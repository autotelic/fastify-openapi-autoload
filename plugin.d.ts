import { FastifyPluginCallback  } from 'fastify'
import { FastifyOpenapiGlueOptions } from 'fastify-openapi-glue'

type FastifyOpenapiAutoloadPlugin = FastifyPluginCallback<NonNullable<fastifyOpenapiAutoload.OpenapiAutoloadOptions>>

declare namespace fastifyOpenapiAutoload {
  export interface OpenapiAutoloadOptions {
    handlersDir: string
    openapiOpts: FastifyOpenapiGlueOptions
  }

  export const fastifyOpenapiAutoload: FastifyOpenapiAutoloadPlugin
  export { fastifyOpenapiAutoload as default }
}

declare function fastifyOpenapiAutoload(
  ...params: Parameters<FastifyOpenapiAutoloadPlugin>
): ReturnType<FastifyOpenapiAutoloadPlugin>

export = fastifyOpenapiAutoload
