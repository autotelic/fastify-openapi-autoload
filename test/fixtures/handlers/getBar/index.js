export default async (fastify, { operationId }) => {
  fastify.decorate(operationId, async (_req, reply) => {
    reply.code(200).send('bar')
  })
}

export const autoConfig = { operationId: 'getBar' }
