import { existsSync } from 'fs'

import { fastifyAutoload } from '@fastify/autoload'
import openapiGlue from 'fastify-openapi-glue'
import fastifyPlugin from 'fastify-plugin'

async function openapiAutoload (fastify, options = {}) {
  const { handlersDir, openapiOpts = {}, makeSecurityHandlers, makeOperationResolver } = options
  const { specification, operationResolver = null } = openapiOpts

  // Validate handlers directory
  if (!handlersDir || !existsSync(handlersDir)) {
    throw new Error('fastify-openapi-autoload: Missing or invalid `handlersDir`. Please specify a valid directory where your handlers are located.')
  }

  // Validate OpenAPI specification
  if (!specification || !existsSync(specification)) {
    throw new Error('fastify-openapi-autoload: Missing or invalid `openapi.specification`. Please provide a valid OpenAPI specification file.')
  }

  try {
    // Register handlers with fastifyAutoload
    fastify.register(fastifyAutoload, {
      dir: handlersDir,
      maxDepth: 1,
      dirNameRoutePrefix: false,
      encapsulate: false
    })

    const openapiGlueOpts = {
      operationResolver: operationResolver || defaultResolverFactory(fastify),
      ...openapiOpts
    }

    // Factory/creator functions for security handlers & operation resolver
    if (makeSecurityHandlers) {
      openapiGlueOpts.securityHandlers = makeSecurityHandlers(fastify)
    }

    if (makeOperationResolver) {
      openapiGlueOpts.operationResolver = makeOperationResolver(fastify)
    }

    // Register openapiGlue for OpenAPI integration
    fastify.register(openapiGlue, openapiGlueOpts)
  } catch (error) {
    const errorMessage = `fastify-openapi-autoload: Error registering plugins - ${error.message}`
    fastify.log.error(errorMessage)
    throw new Error(errorMessage)
  }
}

function defaultResolverFactory (fastify) {
  return (operationId) => {
    fastify.log.info(`fastify-openapi-autoload - has '${operationId}' decorator: ${fastify.hasDecorator(operationId)}`)
    return fastify[operationId]
  }
}

const fastifyOpenapiAutoload = fastifyPlugin(openapiAutoload, {
  name: 'fastify-openapi-autoload'
})

export { fastifyOpenapiAutoload }
export default fastifyOpenapiAutoload
