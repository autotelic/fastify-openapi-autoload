export default async (fastify, { operationId, foo }) => {
  fastify.decorate(operationId, async (_req, reply) => {
    reply.code(200).send(foo)
  })
}

export const autoConfig = { operationId: 'getBar' }
