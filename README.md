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

export default async function app (fastify, opts) {
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
 export default async function app(fastify, options) {
  fastify.register(openapiAutoload, {
    handlersDir: '/path/to/handlers',
    //...
  })
}
 ```

### `openapiOpts` (required)

 OpenAPI-related options. Refer to [fastify-openapi-glue documentation](https://github.com/seriousme/fastify-openapi-glue?tab=readme-ov-file#options) for more details.

 ```js
// example
 export default async function app(fastify, options) {
  fastify.register(openapiAutoload, {
    openapiOpts: {
      specification: '/path/to/openapi/spec.yaml'
    },
    //...
  })
}
 ```

### `jwksOpts` (optional)

`@autotelic/fastify-openapi-autoload` comes prepackaged with jwt/jwks security handlers setup for an openAPI spec. When the `jwksOpts.whiteListedIssuer` is provided, [@fastify/jwt](https://github.com/fastify/fastify-jwt) is registered and the request is decorated with an authentication method. You will need to set up a `.well-known/jwks-json` route (see [`get-jwks` docs](https://github.com/nearform/get-jwks?tab=readme-ov-file#getjwk) for more on this) and a bearerAuth security schema in your openAPI spec. See the example app for a basic configuration.

you can pass any [GetJWKS options](https://github.com/nearform/get-jwks?tab=readme-ov-file#options) to the `jwksOpts` object, however, to register the necessary plugins and decorators, the`whiteListedIssuer` option _must_ be provided.

 ```js
// example
 export default async function app(fastify, options) {
  fastify.register(openapiAutoload, {
    jwksOpts: {
      whiteListedIssuer: 'https://your-domain.com/'
    },
    //...
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
