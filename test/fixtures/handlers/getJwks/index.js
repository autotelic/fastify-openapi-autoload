export default async (fastify, { operationId }) => {
  fastify.decorate(operationId, async () => ({
    keys: [{
      kty: 'RSA',
      n: 'n',
      e: 'e',
      kid: 'kid'
    }]
  }))
}

export const autoConfig = { operationId: 'getJwks' }
