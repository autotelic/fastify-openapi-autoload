# Fastify OpenAPI Autoload

This Fastify plugin, `fastify-openapi-autoload`, integrates [`fastify-openapi-glue`](https://github.com/seriousme/fastify-openapi-glue) for OpenAPI specification handling and [`@fastify/autoload`](https://github.com/fastify/fastify-autoload) for automatically loading route handlers. It simplifies the process of setting up an API server using Fastify with an OpenAPI specification.

## Features

- **OpenAPI Integration**: Seamlessly integrates with `fastify-openapi-glue` to handle API routes as defined in your OpenAPI specification.
- **Automatic Loading of Route Handlers**: Automatically loads route handlers from a specified directory, reducing the boilerplate code for route setup.

## Usage

```sh
npm i @autotelic/fastify-openapi-autoload
```

## Requirements

- Node.js
- Fastify
- An OpenAPI specification file
- A directory containing Fastify route handlers

## Example

```js
import fastify from 'fastify'
import  openapiAutoload from '@autotelic/fastify-openapi-autoload'

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

To confirm the spec provided in the example is processed, make the follow requests:

```sh
http GET :3000/foo
http GET :3000/bar
http POST :3000/baz
```

## API

### openapiAutoload(fastify, options)

- `fastify`: The Fastify instance.

- `options`: Configuration options for the plugin.
  - `handlersDir`: (Required) Directory path for route handlers.
  - `openapiOpts`: (Required) Options related to OpenAPI. See [fastify-openapi-glue docs](https://github.com/seriousme/fastify-openapi-glue?tab=readme-ov-file#options) for details.
    - `specification`: (Required) Path to the OpenAPI specification file or the specification object itself.

## Github Actions/Workflows

### Triggering a Release

Trigger the release workflow via release tag

  ```sh
  git checkout main && git pull
  npm version { minor | major | path }
  git push --follow-tags
  ```
