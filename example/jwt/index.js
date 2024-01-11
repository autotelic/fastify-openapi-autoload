import { readFileSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

import { createSigner } from 'fast-jwt'
import fastifyPlugin from 'fastify-plugin'
import { generateKeyPair, importSPKI, exportJWK } from 'jose'

import openapiAutoload from '../../index.js'
import { jwtJwksHandler } from '../../lib/jwtJwks.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const fixturesDir = join(__dirname, 'routes')

const ISSUER = 'https://autotelic.localhost:3000/'

export default async function app (fastify, opts) {
  // mock jwks endpoint and jwt token:
  const { jwk, jwtToken } = await generateKeys()
  fastify.register(fastifyPlugin(async (fastify, options) => {
    const { operationId = 'getJwks' } = options
    fastify.decorate(operationId, async () => ({ keys: [jwk] }))
  }))
  console.log('\n\x1b[33m ========HTTPie test request:========\x1b[0m\n')
  console.log(`\x1b[33mhttp https://autotelic.localhost:3000/foo 'Authorization:Bearer ${jwtToken}'\x1b[0m\n\n`)

  // use jwt/jwks as security handler:
  const makeSecurityHandlers = jwtJwksHandler({ issuer: ISSUER, authRequestDecorator: auth })

  // register openapiAutoload:
  fastify.register(openapiAutoload, {
    handlersDir: join(fixturesDir, 'handlers'),
    openapiOpts: { specification: join(fixturesDir, 'spec', 'test-spec.yaml') },
    makeSecurityHandlers
  })
}

export const options = {
  https: {
    key: readFileSync(join('local-certs', 'autotelic.localhost-key.pem')),
    cert: readFileSync(join('local-certs', 'autotelic.localhost.pem'))
  },
  maxParamLength: 500
}

// ==== HELPER FUNCTION TO GENERATE JWT TOKEN AND JWK ==== //
async function generateKeys () {
  const JWT_SIGNING_ALGORITHM = 'RS256'
  const { publicKey, privateKey } = await generateKeyPair(JWT_SIGNING_ALGORITHM)

  const JWT_KEY_ID = 'test-key-id'
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
  return {
    jwtToken: jwtSign({ userId: '123' }),
    jwk
  }
}

// ==== AUTH & SECURITY HANDLERS ==== //
async function auth (request) {
  try {
    const decodedToken = await request.jwtVerify(request)
    const { userId } = decodedToken
    return userId
  } catch (err) {
    return null
  }
}
