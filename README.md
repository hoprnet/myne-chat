Myne-chat is an application powered by [HOPR](https://github.com/hoprnet/hoprnet).

## Getting Started

First, run the development server:

```bash
yarn dev
```

Second, run a mock server which simulates a HOPRd node:

```bash
yarn mocks
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Learn More

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

If order to run Myne Chat, a user has two options: (1) Use a deployed version of Myne Chat available at https://app.myne.chat; (2) or run Myne Chat locally. Myne Chat doesn't exchange data with the host which it is served from, but still the most privacy-preserving option is to run Myne Chat locally.

This tutorial shows how to set up option 2 including a locally running hoprd node.

1. You need to start a local hoprd node (at least v1.85.0). Multiple ways to do this are described in the hoprd documentation. For simplicity, use Docker and spin up a node locally using the `budapest` release:
```
docker run --pull always -p 3000:3000 -p 3001:3001 gcr.io/hoprassociation/hoprd:budapest --apiToken ^MYtoken4testing^ --password hodlerATWORK --rest --admin --init
```
To be able to use the node you must fund it with native (xDAI) and HOPR tokens.
1. Following that, Myne Chat should be build locally:
```
git clone https://github.com/hoptnet/myne-chat
cd myne-chat
yarn
yarn build
```
1. Now Myne Chat can be started:
```
yarn dev
```
As a result you may now navigate to http://localhost:3002/ and view the Myne Chat UI.
1. Now the local hoprd node can be configured as the endpoint within your Myne Chat UI. Click on the settings icon in the top left corner and enter the following details:
    - HTTP Endpoint: http://localhost:3001
    - WS Endpoint: ws://localhost:3000
    - Security Token: ^MYtoken4testing^
1. Once save, Myne Chat should connect to the hoprd node. The Myne Chat logo will turn white once it has successfully connected.

Now Myne Chat and hoprd are set up.

For each chat you will need to open a channel to the given peer through the hoprd admin UI. Then you may start a chat within Myne Chat itself.
