import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

import { createSigner } from 'fast-jwt'
import Fastify from 'fastify'
import { generateKeyPair, importSPKI, exportJWK } from 'jose'
import nock from 'nock'
import { test, beforeEach, afterEach } from 'tap'

import openapiAutoload from '../index.js'
import { jwtJwksHandler } from '../lib/jwtJwks.js'

beforeEach(() => {
  nock.disableNetConnect()
})

afterEach(() => {
  nock.cleanAll()
  nock.enableNetConnect()
})

const __dirname = dirname(fileURLToPath(import.meta.url))
const fixtureDir = join(__dirname, 'fixtures')

const ISSUER = 'https://autotelic.localhost:3000/'

async function buildApp () {
  const fastify = Fastify()

  const JWT_SIGNING_ALGORITHM = 'RS256'
  const JWT_KEY_ID = 'KEY_0'

  const { publicKey, privateKey } = await generateKeyPair(JWT_SIGNING_ALGORITHM)

  const spki = await importSPKI(publicKey.export({
    format: 'pem',
    type: 'spki'
  }), JWT_SIGNING_ALGORITHM)

  const jwk = await exportJWK(spki)
  jwk.alg = JWT_SIGNING_ALGORITHM
  jwk.kid = JWT_KEY_ID
  jwk.use = 'sig'

  const jwtSign = createSigner({
    key: privateKey.export({ format: 'pem', type: 'pkcs8' }),
    iss: ISSUER,
    kid: JWT_KEY_ID
  })
  const jwtToken = jwtSign({ userId: 123 })

  // nock endpoint for jwks
  nock(ISSUER).get('/.well-known/jwks.json').reply(200, { keys: [jwk] })

  const makeSecurityHandlers = jwtJwksHandler({ issuer: ISSUER })

  fastify.register(openapiAutoload, {
    handlersDir: join(fixtureDir, 'handlers'),
    openapiOpts: { specification: join(fixtureDir, 'spec-with-security.yaml') },
    makeSecurityHandlers
  })

  return { fastify, jwtToken }
}

test('fastify-openapi-autoload with jwtJwks handlers should register @fastify/jwt', async ({ ok, teardown }) => {
  teardown(async () => fastify.close())
  const { fastify } = await buildApp()
  await fastify.ready()

  ok(fastify.hasPlugin('@fastify/jwt'))
})

test('fastify-openapi-autoload with jwtJwks handlers should reject secure routes without a bearer token', async ({ same, teardown }) => {
  teardown(async () => fastify.close())
  const { fastify } = await buildApp()

  const results = await fastify.inject({
    method: 'GET',
    url: '/foo'
  })

  same(results.json(), {
    statusCode: 401,
    error: 'Unauthorized',
    message: 'None of the security schemes (bearerAuth) successfully authenticated this request.'
  })
})

test('fastify-openapi-autoload with jwtJwks handlers should pass secure routes with a bearer token', async ({ same, teardown }) => {
  teardown(async () => fastify.close())
  const { fastify, jwtToken } = await buildApp()
  await fastify.ready()

  const results = await fastify.inject({
    method: 'GET',
    url: '/foo',
    headers: {
      authorization: `Bearer ${jwtToken}`
    }
  })

  same(results.json(), { userId: 123 })
})
