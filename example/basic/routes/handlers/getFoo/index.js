export default async (fastify, { operationId }) => {
  fastify.decorate(operationId, async (req, reply) => {
    reply.code(200).send({ foo: 'bar' })
  })
}

export const autoConfig = { operationId: 'getFoo' }
