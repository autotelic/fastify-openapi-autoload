import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

import fastifyInjector from '@autotelic/fastify-injector'
import { test } from 'tap'

import openapiAutoload from '../index.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const fixturesDir = join(__dirname, 'fixtures')

function buildApp ({
  hasHandlersDir = true,
  handlersDir = join(fixturesDir, 'handlers'),
  hasSpec = true,
  specification = join(fixturesDir, 'test-spec.yaml'),
  hasPluginError = false
} = {}) {
  const injectorOpts = {}
  if (hasPluginError) {
    injectorOpts.plugins = { 'fastify-openapi-glue': new Error('fastify-openapi-glue error') }
  }

  const fastify = fastifyInjector(injectorOpts)

  const pluginOpts = {}

  if (hasHandlersDir) {
    pluginOpts.handlersDir = handlersDir
  }

  if (hasSpec) {
    pluginOpts.openapiOpts = { specification }
  }

  fastify.register(openapiAutoload, pluginOpts)

  return fastify
}

test('Should throw an error if the `handlersDir` param is missing', async ({ rejects }) => {
  const fastify = buildApp({ hasHandlersDir: false })

  const appError = new Error('fastify-openapi-autoload: Missing or invalid `handlersDir`. Please specify a valid directory where your handlers are located.')

  rejects(fastify.ready(), appError)
})

test('Should throw an error if the `handlersDir` path is invalid', async ({ rejects, teardown }) => {
  teardown(async () => fastify.close())
  const fastify = buildApp({ handlersDir: join(fixturesDir, 'invalidPath') })

  const appError = new Error('fastify-openapi-autoload: Missing or invalid `handlersDir`. Please specify a valid directory where your handlers are located.')
  rejects(fastify.ready(), appError)
})

test('Should throw an error if the `specification` param is missing', async ({ rejects, teardown }) => {
  teardown(async () => fastify.close())
  const fastify = buildApp({ hasSpec: false })

  const appError = new Error('fastify-openapi-autoload: Missing or invalid `openapi.specification`. Please provide a valid OpenAPI specification file.')
  rejects(fastify.ready(), appError)
})

test('Should throw an error if the `specification` path is invalid', async ({ rejects, teardown }) => {
  teardown(async () => fastify.close())
  const fastify = buildApp({ specification: 'invalidPath' })

  const appError = new Error('fastify-openapi-autoload: Missing or invalid `openapi.specification`. Please provide a valid OpenAPI specification file.')
  rejects(fastify.ready(), appError)
})

test('Plugin error handling', async ({ equal, rejects, teardown }) => {
  teardown(async () => fastify.close())
  const fastify = buildApp({ hasPluginError: true })

  fastify.log.error = (msg) => {
    equal(msg, 'fastify-openapi-autoload: Error registering plugins - fastify-plugin expects a function, instead got a \'object\'')
  }

  rejects(fastify.ready(), new Error('fastify-openapi-autoload: Error registering plugins - fastify-plugin expects a function, instead got a \'object\''))
})
