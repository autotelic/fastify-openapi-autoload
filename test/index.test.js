import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

import fastifyInjector from '@autotelic/fastify-injector'
import { test } from 'tap'

import openapiAutoload from '../index.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const fixturesDir = join(__dirname, 'fixtures')

function buildApp ({
  operationResolver,
  makeOperationResolver,
  makeSecurityHandlers
} = {}) {
  const fastify = fastifyInjector()

  const pluginOpts = {
    handlersDir: join(fixturesDir, 'handlers'),
    openapiOpts: {
      specification: join(fixturesDir, 'test-spec.yaml')
    }
  }

  if (operationResolver) {
    pluginOpts.openapiOpts.operationResolver = operationResolver
  }

  if (makeOperationResolver) {
    pluginOpts.makeOperationResolver = makeOperationResolver
  }
  if (makeSecurityHandlers) {
    pluginOpts.makeSecurityHandlers = makeSecurityHandlers
  }

  fastify.register(openapiAutoload, pluginOpts)

  return fastify
}

test('plugin should exist', async ({ ok, teardown }) => {
  teardown(async () => fastify.close())

  const fastify = buildApp()
  await fastify.ready()

  ok(fastify.hasPlugin('fastify-openapi-autoload'))
  ok(fastify.hasPlugin('fastify-openapi-glue'))
})

test('should register routes', async ({ equal, teardown }) => {
  teardown(async () => fastify.close())

  const fastify = buildApp()
  await fastify.ready()

  const expectedRoutes = '└── /\n' +
  '    ├── foo (GET, HEAD)\n' +
  '    └── ba\n' +
  '        ├── r (GET, HEAD)\n' +
  '        └── z (POST)\n'
  const routes = fastify.printRoutes()

  // OpenAPI doesn't register routes traditionally, but we can print all routes to check:
  equal(routes, expectedRoutes)
})

test('should use default operation resolvers', async ({ ok, teardown }) => {
  teardown(async () => fastify.close())

  const fastify = buildApp()
  await fastify.ready()

  ok(fastify.getFoo)
  ok(fastify.getBar)
  ok(fastify.postBaz)
})

test('should use a custom operation resolver if provided', async ({ equal, teardown }) => {
  teardown(async () => fastify.close())
  const fastify = buildApp({
    operationResolver: (operationId) => {
      if (operationId === 'getFoo') {
        return async (_req, reply) => {
          reply.code(200).send('this is a test')
        }
      }
    }
  })

  await fastify.ready()

  const response = await fastify.inject({
    method: 'GET',
    url: '/foo'
  })

  equal(response.statusCode, 200)
  equal(response.body, 'this is a test')
})

test('should use a custom operation resolver factory if provided', async ({ equal, teardown }) => {
  teardown(async () => fastify.close())
  const fastify = buildApp({
    makeOperationResolver: (fastify) => (operationId) => {
      if (operationId === 'getFoo') {
        return async (_req, reply) => {
          reply.code(200).send('this is a test')
        }
      }
      return fastify[operationId]
    }
  })

  await fastify.ready()

  const fooResponse = await fastify.inject({
    method: 'GET',
    url: '/foo'
  })

  equal(fooResponse.statusCode, 200)
  equal(fooResponse.body, 'this is a test')

  const barResponse = await fastify.inject({
    method: 'GET',
    url: '/bar'
  })

  equal(barResponse.statusCode, 200)
  equal(barResponse.body, 'bar')
})

test('should use a custom security handlers factory if provided', async ({ equal, same, teardown }) => {
  teardown(async () => fastify.close())
  const fastify = buildApp({
    makeSecurityHandlers: (fastify) => {
      fastify.decorateRequest('authenticate', async () => 123)
      return {
        async bearerAuth (request, reply, params) {
          try {
            const userId = await request.authenticate(request)
            if (userId == null) throw new Error('no user id')
          } catch (e) {
            throw new Error(e)
          }
        }
      }
    }
  })

  await fastify.ready()

  const fooResponse = await fastify.inject({
    method: 'GET',
    url: '/foo'
  })

  equal(fooResponse.statusCode, 200)
  same(fooResponse.json(), { userId: 123 })
})
