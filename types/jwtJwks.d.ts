import { FastifyRequest } from 'fastify'
import { GetJwksOptions } from 'get-jwks'

export interface JwtJwksOptions {
  issuer: string
  jwksOpts?: GetJwksOptions
  authRequestDecorator?: (request: FastifyRequest) => Promise<object>
  securityHandlers?: object
}

export function jwtJwksHandler(options: JwtJwksOptions): object
