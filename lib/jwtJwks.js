import https from 'node:https'

import fastifyJwt from '@fastify/jwt'
import buildGetJwks from 'get-jwks'

export function jwtJwksHandler ({
  jwksOpts = {},
  issuer,
  authRequestDecorator = defaultAuth,
  securityHandlers = defaultHandlers
} = {}) {
  const {
    max = 100,
    ttl = 60 * 1000,
    timeout = 5000,
    providerDiscovery = false,
    agent = new https.Agent({ keepAlive: true }),
    ...opts
  } = jwksOpts

  const getJwks = buildGetJwks({
    max,
    ttl,
    timeout,
    issuersWhitelist: [issuer],
    checkIssuer: (iss) => iss === issuer,
    providerDiscovery,
    agent,
    ...opts
  })

  return function makeSecurityHandler (fastify) {
    // Register JWT verify
    fastify.register(fastifyJwt, {
      decode: { complete: true },
      secret: (_request, token, callback) => {
        const { header: { kid, alg }, payload: { iss } } = token
        return getJwks.getPublicKey({ kid, domain: iss, alg })
          .then(publicKey => callback(null, publicKey), callback)
      }
    })

    // Decorate request with authenticate method
    fastify.decorateRequest('authenticate', authRequestDecorator)

    return securityHandlers
  }
}

async function defaultAuth (request) {
  try {
    const decodedToken = await request.jwtVerify(request)
    const { userId } = decodedToken
    return userId
  } catch (err) {
    return null
  }
}

const defaultHandlers = {
  async bearerAuth (request, reply, params) {
    try {
      const userId = await request.authenticate(request)
      if (userId == null) throw new Error('no user id')
    } catch (e) {
      throw new Error(e)
    }
  }
}
