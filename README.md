# Fastify OpenAPI Autoload Documentation

The `fastify-openapi-autoload` plugin is a tool for building API servers with Fastify, leveraging OpenAPI specifications. It integrates [`fastify-openapi-glue`](https://github.com/seriousme/fastify-openapi-glue) for handling OpenAPI specs and [`@fastify/autoload`](https://github.com/fastify/fastify-autoload) for auto-loading route handlers, streamlining the API setup process.

## Features

- **OpenAPI Integration**: Utilizes `fastify-openapi-glue` to automatically handle routes as defined in your OpenAPI spec.
- **Automatic Route Handlers Loading**: Loads route handlers from a specified directory, significantly reducing route setup code.

## Installation

To install the plugin, run:

```sh
npm i @autotelic/fastify-openapi-autoload
```

## Prerequisites

- Node.js
- Fastify
- OpenAPI specification file
- Directory with Fastify OpenAPI route handlers

## Example

```js
import fastify from 'fastify'
import openapiAutoload from '@autotelic/fastify-openapi-autoload'

export default async function app (fastify, options) {
  fastify.register(openapiAutoload, {
    handlersDir: '/path/to/handlers',
    openapiOpts: {
      specification: '/path/to/openapi/spec.yaml'
    }
  })
}
```

To run an example app, see [this guide](./example/README.md)

## API Reference - Options

### `handlersDir` (required)

Path to the route handlers directory.

 ```js
// example:
 export default async function app (fastify, options) {
  fastify.register(openapiAutoload, {
    handlersDir: '/path/to/handlers',
    // Other configuration options...
  })
}
 ```

### `openapiOpts` (required)

OpenAPI-related options. Refer to [fastify-openapi-glue documentation](https://github.com/seriousme/fastify-openapi-glue?tab=readme-ov-file#options) for more details. At minimum, `specification` must be defined. This can be a JSON object, or the path to a JSON or YAML file containing a valid OpenApi(v2/v3) file. If `specification` is a path to a yaml file, `fastify-openapi-autoload` supports multi-file resolving. See [this test directory](./test/fixtures/multi-file-spec/) for example.

 ```js
// example
 export default async function app (fastify, options) {
  fastify.register(openapiAutoload, {
    openapiOpts: {
      specification: '/path/to/spec/openapi.yaml'
    },
    // Other configuration options...
  })
}
 ```

### `makeOperationResolver` (optional)

By default, the `fastify-openapi-autoload` provides a standard resolver that locates a handler based on the operation ID, looking for a matching decorator method in the Fastify instance. However, if your application requires a different mapping strategy or additional logic for resolving operations, you can provide a custom resolver function.

The custom resolver should be a factory function that receives the Fastify instance as an argument and returns an operation resolver function. This resolver function, when invoked with an `operationId`, should return the corresponding handler function for that specific operation.

For more information on the operation resolver, refer to the [`fastify-openapi-glue operation resolver documentation`](https://github.com/seriousme/fastify-openapi-glue/blob/master/docs/operationResolver.md).

 ```js
// example
export default async function app (fastify, options) {
  fastify.register(openapiAutoload, {
    makeOperationResolver: (fastify) => (operationId) => {
      // Custom logic to determine the handler function for the given operationId
      // For example, returning a fixed response for demonstration:
      return async (_req, reply) => {
        reply.code(200).send(`Custom response for operation ${operationId}`)
      }
    },
    // Other configuration options...
  })
}
 ```

### `makeSecurityHandlers` (optional)

If your application requires custom security handlers for your OpenAPI handlers, you can provide a factory function similar to the `makeOperationResolver` option.

This factory function should take the Fastify instance as an argument and return an object containing the security handlers. Each handler within this object should implement the logic for handling security aspects as defined in your OpenAPI specification.

For guidance on implementing security handlers, see the [`fastify-openapi-glue security handlers documentation`](https://github.com/seriousme/fastify-openapi-glue/blob/master/docs/securityHandlers.md).

Example usage:

```js
// example
export default async function app (fastify, options) {
  fastify.register(openapiAutoload, {
    makeSecurityHandlers: (fastify) => {
      // Custom logic for security handlers
      return {
        someSecurityHandler: (notOk) => {
          if (notOk) {
            throw new Error('not ok')
          }
        }
      }
    },
    // Other configuration options...
  })
}
```

## JSON Web Token Security Handler

The `jwtJwksHandler` function, exported with the `fastify-openapi-autoload` plugin, allows you to integrate JWT/JWKS authentication as security handlers.

To use this function, you need to install the following dependencies:

```sh
npm i @autotelic/fastify-openapi-autoload @fastify/jwt get-jwks
```

### Options

When configuring `jwtJwksHandler`, you can customize its behavior with the following options:

- `jwksOpts` (optional): See [`get-jwks` documentation](https://github.com/nearform/get-jwks) for details.
- `issuer` (*required): The issuer URL of the JWT tokens. This is typically the base URL of the token provider. Required option if `jwksOpts.issuersWhitelist` & `jwksOpts.checkIssuer` options are not provided.
- `authRequestDecorator` (optional - default provided): A function to decorate the Fastify request with custom JWT authentication logic.
- `securityHandlers` (optional - default provided): An object containing Fastify security handlers.

### Example Usage

```js
import fastify from 'fastify'
import openapiAutoload from '@autotelic/fastify-openapi-autoload'
import { jwtJwksHandler } from '@autotelic/fastify-openapi-autoload/jwtJwks'

export default async function app (fastify, options) {
  const makeSecurityHandlers = jwtJwksHandler({
    issuer: 'https://your-issuer-url.com',
    jwksOpts: {
      max: 100,
      ttl: 60000,
      timeout: 5000
      // ...additional JWKS options
    },
    // Custom authentication request decorator (optional)
    authRequestDecorator: async (request) => {
      try {
        const decodedToken = await request.jwtVerify(request)
        const { userId } = decodedToken
        return userId
      } catch (err) {
        return null
      }
    }
  })

  fastify.register(openapiAutoload, {
    handlersDir: '/path/to/handlers',
    openapiOpts: {
      specification: '/path/to/openapi/spec.yaml'
    },
    makeSecurityHandlers
  })
}
```

## Plugin Development: Triggering a Release

To trigger a new release:

  ```sh
  git checkout main && git pull
  npm version { minor | major | patch }
  git push --follow-tags
  ```
