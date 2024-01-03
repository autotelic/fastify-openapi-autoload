export default async (fastify, { operationId }) => {
  fastify.decorate(operationId, async (_req, reply) => {
    reply.code(204).send('baz')
  })
}

export const autoConfig = { operationId: 'postBaz' }
