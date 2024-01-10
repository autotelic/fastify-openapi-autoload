import type { FastifyPluginCallback } from 'fastify'
import type { FastifyOpenapiGlueOptions } from 'fastify-openapi-glue'

export interface OpenapiAutoloadOptions {
  handlersDir: string
  openapiOpts: FastifyOpenapiGlueOptions
}

declare const fastifyOpenapiAutoload: FastifyPluginCallback<OpenapiAutoloadOptions>

export default fastifyOpenapiAutoload
export { fastifyOpenapiAutoload }
