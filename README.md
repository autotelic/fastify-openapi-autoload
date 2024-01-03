# Fastify OpenAPI Autoload

This Fastify plugin, `fastify-openapi-autoload`, integrates `fastify-openapi-glue` for OpenAPI specification handling and `@fastify/autoload` for automatically loading route handlers. It simplifies the process of setting up an API server using Fastify with an OpenAPI specification.

## Features

- **OpenAPI Integration**: Seamlessly integrates with `fastify-openapi-glue` to handle API routes as defined in your OpenAPI specification.
- **Automatic Route Handlers Loading**: Automatically loads route handlers from a specified directory, reducing the boilerplate code for route setup.

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

export default async function (fastify, opts) {
  fastify.register(openapiAutoload, {
    handlersDir: '/path/to/handlers',
    openapiSpec: '/path/to/openapi/spec.yaml'
  })

  //...
}

```

## API

### openapiAutoload(fastify, options)

- `fastify`: The Fastify instance.
- `options`: Configuration options for the plugin.
  - `handlersDir`: (Required) Directory path for route handlers.
  - `openapiSpec`: (Required) Path to the OpenAPI specification file.

## Github Actions/Workflows

### Triggering a Release

Trigger the release workflow via release tag

  ```sh
  git checkout main && git pull
  npm version { minor | major | path }
  git push --follow-tags
  ```
