// eslint-disable-next-line import/no-unresolved
import { expectType, expectError } from 'tsd'

import { jwtJwksHandler } from '../lib/jwtJwks'

const options = {
  issuer: 'https://example.com',
  jwksOpts: {
    cache: true,
    rateLimit: true
  },
  authRequestDecorator: async () => ({ user: 'test' })
}

expectType<object>(jwtJwksHandler(options))

expectError(jwtJwksHandler({
  issuer: 123,
  jwksOpts: {
    cache: 'yes',
    rateLimit: 'no'
  }
}))

const minimalOptions = {
  issuer: 'https://example.com'
}
expectType<object>(jwtJwksHandler(minimalOptions))
