import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

import fastifyInjector from '@autotelic/fastify-injector'
import { test } from 'tap'

import openapiAutoload from '../index.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const fixturesDir = join(__dirname, 'fixtures')

function buildApp () {
  const fastify = fastifyInjector()

  fastify.register(openapiAutoload, {
    handlersDir: join(fixturesDir, 'handlers'),
    openapiOpts: {
      specification: join(fixturesDir, 'multi-file-spec', 'openapi.yaml'),
      resolveMultiSpec: true
    }
  })

  return fastify
}

test('Should register routes with multi file spec', async ({ equal, teardown }) => {
  teardown(() => fastify.close())

  const fastify = buildApp()
  await fastify.ready()

  const expectedRoutes = '└── /\n' +
  '    ├── foo (GET, HEAD)\n' +
  '    ├── ba\n' +
  '    │   ├── r (GET, HEAD)\n' +
  '    │   └── z (POST)\n' +
  '    └── .well-known/jwks.json (GET, HEAD)\n'

  const routes = fastify.printRoutes()
  equal(routes, expectedRoutes)
})

test('Should make operation resolvers with multi file spec', async ({ ok, teardown }) => {
  teardown(() => fastify.close())

  const fastify = buildApp()
  await fastify.ready()

  ok(fastify.getFoo)
  ok(fastify.getBar)
  ok(fastify.postBaz)
  ok(fastify.getJwks)
})
