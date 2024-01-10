import fastify, { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
// eslint-disable-next-line import/no-unresolved
import { expectAssignable, expectError } from 'tsd'

import fastifyOpenapiAutoload from '..'

const opt1 = {
  handlersDir: '/path/to/handlers',
  openapiOpts: {
    specification: {
      openapi: '3.1.0'
    }
  }
}
expectAssignable<FastifyInstance>(fastify().register(fastifyOpenapiAutoload, opt1))

const opt2 = {
  handlersDir: '/path/to/handlers',
  openapiOpts: {
    specification: '/path/to/openapi/spec.yaml'
  }
}

const opt3 = {
  handlersDir: '/path/to/handlers',
  openapiOpts: {
    specification: '/path/to/openapi/spec.yaml',
    serviceHandlers: { name: 'service-name' },
    securityHandlers: { bearerAuth: [] },
    operationResolver: (operationId: string,
      method: string,
      path: string
    ) => (req: FastifyRequest, res: FastifyReply) => ({ operationId, method, path, req, res }),
    prefix: '/api/v1'
  }
}

expectAssignable<FastifyInstance>(fastify().register(fastifyOpenapiAutoload, opt2))
expectAssignable<FastifyInstance>(fastify().register(fastifyOpenapiAutoload, opt3))

const errOpt1 = {}

const errOpt2 = {
  handlersDir: '/path/to/handlers',
  openapiOpts: '/path/to/openapi/spec.yaml'
}

const errOpt3 = {
  openapiOpts: {}
}

expectError(fastify().register(fastifyOpenapiAutoload, errOpt1))
expectError(fastify().register(fastifyOpenapiAutoload, errOpt2))
expectError(fastify().register(fastifyOpenapiAutoload, errOpt3))
