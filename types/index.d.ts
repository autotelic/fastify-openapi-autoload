import type { FastifyInstance, FastifyPluginCallback } from 'fastify'
import type { FastifyOpenapiGlueOptions } from 'fastify-openapi-glue'
export interface OpenapiAutoloadOptions {
  handlersDir: string
  openapiOpts: FastifyOpenapiGlueOptions,
  makeOperationResolver?: (fastify: FastifyInstance) => FastifyOpenapiGlueOptions['operationResolver'],
  makeSecurityHandlers?: (fastify: FastifyInstance) => FastifyOpenapiGlueOptions['securityHandlers']
}

declare const fastifyOpenapiAutoload: FastifyPluginCallback<OpenapiAutoloadOptions>

export default fastifyOpenapiAutoload
export { fastifyOpenapiAutoload }
