import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

import fastifyInjector from '@autotelic/fastify-injector'
import Fastify from 'fastify'
import { test } from 'tap'

import openapiAutoload from '../index.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const fixturesDir = join(__dirname, 'fixtures')

const handlersDir = join(fixturesDir, 'handlers')
const specification = join(fixturesDir, 'spec', 'test-spec.yaml')

test('fastify-openapi-autoload plugin should exist', async ({ ok }) => {
  const app = Fastify()

  app.register(openapiAutoload, {
    handlersDir,
    openapiOpts: { specification }
  })
  await app.ready()

  ok(app.hasPlugin('fastify-openapi-autoload'))
  ok(app.hasPlugin('fastify-openapi-glue'))
})

test('fastify-openapi-autoload should make operation resolvers', async ({ ok }) => {
  const app = Fastify()

  app.register(openapiAutoload, {
    handlersDir,
    openapiOpts: { specification }
  })
  await app.ready()

  ok(app.getFoo)
  ok(app.getBar)
  ok(app.postBaz)
})

test('fastify-openapi-autoload should register routes', async ({ equal }) => {
  const app = Fastify()

  app.register(openapiAutoload, {
    handlersDir,
    openapiOpts: { specification }
  })
  await app.ready()

  const expectedRoutes = '└── /\n' +
  '    ├── foo (GET, HEAD)\n' +
  '    └── ba\n' +
  '        ├── r (GET, HEAD)\n' +
  '        └── z (POST)\n'
  const routes = app.printRoutes()

  // OpenAPI doesn't register routes traditionally, but we can print all routes to check:
  equal(routes, expectedRoutes)
})

test('fastify-openapi-autoload will use a custom operation resolver if provided', async ({ equal }) => {
  const app = Fastify()

  app.register(openapiAutoload, {
    handlersDir,
    openapiOpts: {
      specification,
      operationResolver: (fastify) => (operationId) => {
        fastify.log.info('custom resolver')
        return fastify[operationId]
      }
    }
  })
  await app.ready()

  app.log.info = (msg) => {
    equal(msg, 'custom resolver')
  }
})

test('fastify-openapi-autoload should throw an error if the `dir` param is missing', async ({ rejects }) => {
  const app = Fastify()

  app.register(openapiAutoload, {
    openapiOpts: { specification }
  })
  const appError = new Error('fastify-openapi-autoload: Missing or invalid `handlersDir`. Please specify a valid directory where your handlers are located.')
  await rejects(app.ready(), appError)
})

test('fastify-openapi-autoload should throw an error if the `dir` path is invalid', async ({ rejects }) => {
  const app = Fastify()

  app.register(openapiAutoload, {
    handlersDir: join(fixturesDir, 'invalidPath'),
    openapiOpts: { specification }
  })
  const appError = new Error('fastify-openapi-autoload: Missing or invalid `handlersDir`. Please specify a valid directory where your handlers are located.')
  await rejects(app.ready(), appError)
})

test('fastify-openapi-autoload should throw an error if the `spec` param is missing', async ({ rejects }) => {
  const app = Fastify()

  app.register(openapiAutoload, {
    handlersDir
  })
  const appError = new Error('fastify-openapi-autoload: Missing or invalid `openapi.specification`. Please provide a valid OpenAPI specification file.')
  await rejects(app.ready(), appError)
})

test('fastify-openapi-autoload should throw an error if the `spec` path is invalid', async ({ rejects }) => {
  const app = Fastify()

  app.register(openapiAutoload, {
    handlersDir,
    openapiOpts: { specification: 'invalidPath' }
  })
  const appError = new Error('fastify-openapi-autoload: Missing or invalid `openapi.specification`. Please provide a valid OpenAPI specification file.')
  await rejects(app.ready(), appError)
})

test('fastify-openapi-autoload plugin error handling', async ({ equal, rejects }) => {
  const app = fastifyInjector({
    plugins: { 'fastify-openapi-glue': {} }
  })

  app.register(openapiAutoload, {
    handlersDir,
    openapiOpts: { specification }
  })

  app.log.error = (msg) => {
    equal(msg, 'fastify-openapi-autoload: Error registering plugins - fastify-plugin expects a function, instead got a \'object\'')
  }

  await rejects(app.ready(), new Error('fastify-openapi-autoload: Error registering plugins - fastify-plugin expects a function, instead got a \'object\''))
})
