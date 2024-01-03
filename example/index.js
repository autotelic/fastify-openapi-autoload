import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

import openapiAutoload from '../plugin.js'

const __dirname = dirname(dirname(fileURLToPath(import.meta.url)))
const fixturesDir = join(__dirname, 'test', 'fixtures')

export default async function (fastify, opts) {
  fastify.register(openapiAutoload, {
    handlersDir: join(fixturesDir, 'handlers'),
    openapi: { specification: join(fixturesDir, 'spec', 'test-spec.yaml') }
  })
}
