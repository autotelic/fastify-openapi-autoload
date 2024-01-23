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

### Running the Example

Start the example server:

```sh
cd ./example
npm i && npm start
```

To confirm the spec provided in the example is processed, make the following requests:

```sh
http GET :3000/foo
http GET :3000/bar
http POST :3000/baz
```

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

OpenAPI-related options. Refer to [fastify-openapi-glue documentation](https://github.com/seriousme/fastify-openapi-glue?tab=readme-ov-file#options) for more details. At minimum, `specification` must be defined. This can be a JSON object, or the path to a JSON or YAML file containing a valid OpenApi(v2/v3) file.

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

The custom resolver function should be a factory function that accepts the Fastify instance as an argument and returns another function. This returned function should be the operation resolver. See the [`fastify-openapi-glue operation resolver docs`](https://github.com/seriousme/fastify-openapi-glue/blob/master/docs/operationResolver.md).

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

## Plugin Development: Triggering a Release

To trigger a new release:

  ```sh
  git checkout main && git pull
  npm version { minor | major | patch }
  git push --follow-tags
  ```
