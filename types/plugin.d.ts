/// <reference types="node" />

import type { FastifyPluginAsync } from 'fastify'
import type { FastifyOpenapiGlueOptions } from 'fastify-openapi-glue'

export interface OpenapiAutoloadOptions {
  handlersDir: string
  openapiOpts: FastifyOpenapiGlueOptions
}

declare const fastifyOpenapiAutoload: FastifyPluginAsync<OpenapiAutoloadOptions>

export default fastifyOpenapiAutoload
export { fastifyOpenapiAutoload }
