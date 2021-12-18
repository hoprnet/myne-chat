Myne-chat is an application powered by [HOPR](https://github.com/hoprnet/hoprnet).

## Getting started

Setting up Myne Chat:

```bash
git clone https://github.com/hoptnet/myne-chat
cd myne-chat
yarn # install libraries
```

## Running Myne Chat

To run a hosting server:

```bash
yarn build # build website
yarn start # run a hosting server
```

Open [http://localhost:8080](http://localhost:8080) with your browser to see the result.

## Developing Myne Chat

To run the development server:

```bash
yarn dev # run development server
```

Open [http://localhost:8080](http://localhost:8080) with your browser to see the result.

## Connecting Myne Chat to a mocked HOPRd API

This repository comes we a mock server which simulates a HOPRd node:

```bash
yarn mocks
```

Two endpoints become available which match the default HOPRd endpoints:

```text
HTTP API=http://localhost:3001
WS API=ws://localhost:3000
```

## Connecting Myne Chat to a real HOPRd API

You need to start a local hoprd node (at least v1.85.0).
See [hopr documentantion](https://docs.hoprnet.org/en/latest/src/install-hoprd/index.html) or checkout the [tutorial](#tutorial) for more info.

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

## Tutorial

In order to run Myne Chat, a user has to setup Myne Chat locally.
This tutorial shows how to set up myne chat and a hoprd node locally.

1. You need to start a local hoprd node (at least v1.85.0). Multiple ways to do this are described in the [hoprd documentation](https://docs.hoprnet.org/en/latest/src/install-hoprd/index.html). For simplicity, use Docker and spin up a node locally using the `budapest` release:

```
docker run --pull always -p 3000:3000 -p 3001:3001 gcr.io/hoprassociation/hoprd:budapest --apiToken ^MYtoken4testing^ --password hodlerATWORK --rest --admin --init
```

To be able to use the node you must fund it with native (xDAI) and HOPR tokens.

2. Following that, Myne Chat needs to be build and start locally.

   1. [Setup Myne Chat](#getting-started)
   2. [Run Myne Chat](#running-myne-chat)

As a result you may now navigate to http://localhost:8080/ and view the Myne Chat UI.

3. Now the local hoprd node can be configured as the endpoint within your Myne Chat UI. Click on the settings icon in the top left corner and enter the following details:

   - HTTP Endpoint: http://localhost:3001
   - WS Endpoint: ws://localhost:3000
   - Security Token: ^MYtoken4testing^

4. Once save, Myne Chat should connect to the hoprd node. The Myne Chat logo will turn white once it has successfully connected.

Now Myne Chat and hoprd are set up.

For each chat you will need to open a channel to the given peer through the hoprd admin UI. Then you may start a chat within Myne Chat itself.
