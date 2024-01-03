import fastify, { FastifyInstance, FastifyPluginCallback } from 'fastify'
import { expectType } from 'tsd'
import * as fastifyOpenapiAutoloadStar from '../..'
import fastifyOpenapiAutoloadDefault, {
  OpenapiAutoloadOptions,
  fastifyOpenapiAutoload as fastifyOpenapiAutoloadNamed
} from '../..'

const fastifyOpenapiAutoloadCjs = require('../..')

const app: FastifyInstance = fastify();
app.register(fastifyOpenapiAutoloadNamed);
app.register(fastifyOpenapiAutoloadDefault);
app.register(fastifyOpenapiAutoloadCjs);
app.register(fastifyOpenapiAutoloadStar.default);
app.register(fastifyOpenapiAutoloadStar.fastifyOpenapiAutoload);

expectType<FastifyPluginCallback<OpenapiAutoloadOptions>>(fastifyOpenapiAutoloadNamed);
expectType<FastifyPluginCallback<OpenapiAutoloadOptions>>(fastifyOpenapiAutoloadDefault);
expectType<FastifyPluginCallback<OpenapiAutoloadOptions>>(fastifyOpenapiAutoloadStar.default);
expectType<FastifyPluginCallback<OpenapiAutoloadOptions>>(fastifyOpenapiAutoloadStar.fastifyOpenapiAutoload);
expectType<any>(fastifyOpenapiAutoloadCjs);

const opt1: OpenapiAutoloadOptions = {
  handlersDir: '/path/to/handlers',
  openapiOpts: {
    specification: {}
  }
}

const opt2: OpenapiAutoloadOptions = {
  handlersDir: '/path/to/handlers',
  openapiOpts: {
    specification: '/path/to/openapi/spec.yaml'
  }
}

const opt3: OpenapiAutoloadOptions = {
  handlersDir: '/path/to/handlers',
  openapiOpts: {
    specification: '/path/to/openapi/spec.yaml',
    serviceHandlers: { name: 'service-name' },
    securityHandlers: { bearerAuth: [] },
    operationResolver: (fastify) => (() => fastify),
    prefix: '/api/v1'
  }
}

app.register(fastifyOpenapiAutoloadDefault, opt1)
app.register(fastifyOpenapiAutoloadDefault, opt2)
app.register(fastifyOpenapiAutoloadDefault, opt3)
