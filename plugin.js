import { existsSync } from 'fs'
import fastifyPlugin from 'fastify-plugin'
import openapiGlue from 'fastify-openapi-glue'
import { fastifyAutoload } from '@fastify/autoload'

/**
 * A Fastify plugin to integrate fastify-openapi-glue and autoload route handlers.
 * @param {Object} fastify - The Fastify instance.
 * @param {Object} options - Configuration options for the plugin.
 * @param {string} options.handlersDir - Directory path for route handlers.
 * @param {string} options.openapi - OpenAPI Glue opts - must include `specification`.
 */
async function openapiAutoload (fastify, options = {}) {
  const { handlersDir, openapi = {} } = options
  const { specification, operationResolver = null } = openapi

  // Validate handlers directory
  if (!handlersDir || !existsSync(handlersDir)) {
    throw new Error('fastify-openapi-autoload: Missing or invalid `handlersDir`. Please specify a valid directory where your handlers are located.')
  }

  // Validate OpenAPI specification
  if (!specification || !existsSync(specification)) {
    throw new Error('fastify-openapi-autoload: Missing or invalid `openapi.specification`. Please provide a valid OpenAPI specification file.')
  }

  try {
    // Register fastifyAutoload for handlers
    await fastify.register(fastifyAutoload, {
      dir: handlersDir,
      maxDepth: 1,
      dirNameRoutePrefix: false,
      encapsulate: false
    })

    // Register openapiGlue for OpenAPI integration
    fastify.register(openapiGlue, {
      specification,
      operationResolver: operationResolver || makeOperationResolver(fastify),
      ...openapi
    })
  } catch (error) {
    const errorMessage = `fastify-openapi-autoload: Error registering plugins - ${error.message}`
    fastify.log.error(errorMessage)
    throw new Error(errorMessage)
  }
}

/**
 * Creates an operation resolver for the OpenAPI plugin.
 * @param {Object} fastify - The Fastify instance.
 * @returns {Function} The operation resolver function.
 */
const makeOperationResolver = (fastify) => {
  return (operationId, method, openapiPath) => {
    fastify.log.info(`fastify-openapi-autoload - has '${operationId}' decorator: ${fastify.hasDecorator(operationId)}`)
    return fastify[operationId]
  }
}

const fastifyOpenapiAutoload = fastifyPlugin(openapiAutoload, {
  name: 'fastify-openapi-autoload'
})

export { fastifyOpenapiAutoload }
export default fastifyOpenapiAutoload
