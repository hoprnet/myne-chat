MyneChat is an application powered by [HOPR](https://github.com/hoprnet/hoprnet).

## Getting started

### Cloud

The easiest way to launch MyneChat and setup a cluster of HOPR nodes to start testing it is via [Gitpod.io](https://gitpod.io). It will automatically fetch and install all the required dependencies and spin up the needed services for you to start tweaking MyneChat.

[![Open in Gitpod](https://gitpod.io/button/open-in-gitpod.svg)](https://gitpod.io/#https://github.com/hoprnet/myne-chat/tree/docs/getting-started-guide-4)

### Locally

#### Dependencies

MyneChat requires the following:

- `node.js@v16`
- `yarn`

#### Installing

First, we need to set up MyneChat in our workstation:

```bash
git clone https://github.com/hoprnet/myne-chat
cd myne-chat
yarn # install libraries
```

#### Developing Myne Chat

To run the development server:

```bash
yarn dev # run development server
```

Open [http://localhost:8080](http://localhost:8080) with your browser to see the result.

#### Run production version

To run MyneChat's production version:

```bash
yarn build # build website
yarn start # run a hosting server
```

Open [http://localhost:8080](http://localhost:8080) with your browser to see the result.

#### Deploy

To deploy MyneChat, you need to build it and then upload it to any static hosting site. MyneChat is currently deployed in [Vercel](https://vercel.com)

#### Connecting MyneChat to a mocked HOPRd node

To use most of its feature, MyneChat comes with a mock server which simulates a HOPRd node:

```bash
yarn mocks
```

Two endpoints become available which match the default HOPRd endpoints:

```text
HTTP API=http://localhost:3001
WS API=ws://localhost:3000
```

#### Connecting Myne Chat to a real HOPRd API

You need to start a local `hoprd` node (at least v1.85.0).
See [hopr documentantion](https://docs.hoprnet.org/en/latest/src/install-hoprd/index.html) or checkout the [tutorial](#tutorial) for more info.

## Tutorial

In order to run MyneChat, a user has to setup MyneChat locally.
This tutorial shows how to set up MyneChat and a `hoprd` node locally.

1. You need to start a local `hoprd` node (at least v1.85.0). Multiple ways to do this are described in the [hoprd documentation](https://docs.hoprnet.org/en/latest/src/install-hoprd/index.html). For simplicity, use Docker and spin up a node locally using the `budapest` release:

```
docker run --pull always -p 3000:3000 -p 3001:3001 gcr.io/hoprassociation/hoprd:budapest --apiToken ^MYtoken4testing^ --password hodlerATWORK --rest --admin --init
```

To be able to use the node you must fund it with native (xDAI) and HOPR tokens.

2. Following that, MyneChat needs to be build and start locally. The easiest way is by installing its dependencies and running it in dev mode.

```
yarn
yarn dev
```

As a result you may now navigate to http://localhost:8080/ and view the MyneChat UI.

3. Now the local `hoprd` node can be configured as the endpoint within your MyneChat UI. Click on the settings icon in the top left corner and enter the following details:

   - HTTP Endpoint: http://localhost:3001
   - WS Endpoint: ws://localhost:3000
   - Security Token: ^MYtoken4testing^

_Important: Your API token might vary, which means it might have unsupported parameters as query parameters (e.g, `%`, `+`). Because we are passing the API token as query string, your token might need to be `URIEncoded` for it to work. To be safe, please make sure it's properly [encoded](https://www.onlinewebtoolkit.com/url-encode-decode) before pasting the API token into the UI. This will be improved in future versions of MyneChat._

4. Once save, MyneChat should connect to the `hoprd` node. The MyneChat logo will turn white once it has successfully connected.

Now MyneChat and `hoprd` are set up.

For each chat you will need to open a channel to the given peer through the `hoprd` admin UI. Then you may start a chat within MyneChat itself.

## Learn More about HOPR

To learn more about HOPR, take a look at the following resources:

- [HOPR Documentation](https://docs.hoprnet.org/)
- [HOPR Repository](https://github.com/hoprnet/hoprnet)

## Libraries & Tooling

- [Next.js](https://nextjs.org) for bootstraping the project
- [Typescript](https://www.typescriptlang.org/) for type checking
- [Eslint](https://eslint.org/) for our linter
- [Prettier](https://prettier.io/) for our code formatter
- [Grommet](https://v2.grommet.io/) for various components
- [Styled-components](https://styled-components.com/) for styling components
- [Immer](https://immerjs.github.io/immer/) for state management