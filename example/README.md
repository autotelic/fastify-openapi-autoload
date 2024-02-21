# Example App

There are two example:

- Basic App
- App with JWT/JWKS Security Handlers

## Basic App

Change directories to `example/basic`
Install dependencies with npm, then run the example server:

```sh
# from root:
cd ./example/basic
npm install
npm start
```

Send a request to /foo, for example with HTTPie:

```sh
http GET :3000/foo
```

## App with Security Handlers

1. First, you'll need to alias localhost to `autotelic.localhost` by updating `/etc/hosts`
2. Install [mkcert](https://github.com/FiloSottile/mkcert). You'll need to [set up your node.js environment to accept the certification](https://github.com/FiloSottile/mkcert?tab=readme-ov-file#using-the-root-with-nodejs) as this doesn't register automatically.
3. Create a certificate in `./example/local-certs`:

    ```sh
    # from root:
    cd ./example/jwt/local-certs
    mkcert "autotelic.localhost"
    ```

4. Ensure the certificate filenames match those in `./example/jwt/index.js`.

### Starting the Example Server

Launch the server with:

```sh
# from root:
cd ./example/jwt
npm i && npm start
```

Once the server is running, a request using HTTPie will print to the console. You can copy and use to test a protected route:

```sh
http https://autotelic.localhost:3000/foo 'Authorization:Bearer <JWT_TOKEN>'
```
