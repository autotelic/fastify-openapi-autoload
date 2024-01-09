import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

import openapiAutoload from '../plugin.js'

const __dirname = dirname(dirname(fileURLToPath(import.meta.url)))
const fixturesDir = join(__dirname, 'test', 'fixtures')

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default async function app (fastify, opts) {
  fastify.register(openapiAutoload, {
    handlersDir: join(fixturesDir, 'handlers'),
    openapiOpts: { specification: join(fixturesDir, 'spec', 'test-spec.yaml') }
  })
}
