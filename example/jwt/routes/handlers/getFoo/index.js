export default async (fastify, { operationId }) => {
  fastify.decorate(operationId, async (req, reply) => {
    try {
      const userId = await req.authenticate(req)
      reply.code(200).send({ userId })
    } catch (err) {
      reply.code(401).send({ error: 'Unauthorized' })
    }
  })
}

export const autoConfig = { operationId: 'getFoo' }
