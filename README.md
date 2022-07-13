<!-- INTRODUCTION -->
<p align="center">
  <a href="https://hoprnet.org" target="_blank" rel="noopener noreferrer">
    <img width="100" src="https://github.com/hoprnet/hopr-assets/blob/master/v1/logo/hopr_logo_padded.png?raw=true" alt="HOPR Logo">
  </a>
  
  <!-- Title Placeholder -->
  <h3 align="center">HOPR MyneChat</h3>
  <p align="center">
    <code>A project by the HOPR Association</code>
  </p>
  <p align="center">
MyneChat is a fully private, data and metadata secure chat. Powered by the HOPR network, with MyneChat no-one can find out your business or who you’re communicating with.
  </p>
  <p align="center">
    <img src="https://img.shields.io/badge/Gitpod-ready--to--code-blue?logo=gitpod" alt="Gitpod">
  </p>
</p>

## Getting started

### Cloud

The easiest way to launch MyneChat and setup a cluster of HOPR nodes to start testing it is via [Gitpod.io](https://gitpod.io). It will automatically fetch and install all the required dependencies and spin up the needed services for you to start tweaking MyneChat.

[![Open in Gitpod](https://gitpod.io/button/open-in-gitpod.svg)](https://gitpod.io/#https://github.com/hoprnet/myne-chat)

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
yarn dev # run development server.
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

Single http endpoint become available which match the default HOPRd endpoints:

```text
HTTP API=http://localhost:8080/api/v2/
```

#### Connecting Myne Chat to a real HOPRd API

To connect a MyneChat instance to a HOPR node, you need to be aware of the following:

- Your HOPR node version needs to be at least version `v1.85.0` to work properly with MyneChat.
- An error will occur when trying to secure from a non-SSL version (e.g. localhost) to a SSL-protected node (e.g. gitpod).
- Your WS (WebSocket) endpoint is the same as the `Admin URL` (`--adminHost` in `hoprd` and `Admin URL` in the setup script).
- A successful connection will highlight the MyneChat logo, turning it white.
- You can verify your connection to your HTTP endpoint by checking the “PeerId” clicking on the "Bar Chart" icon.

For more information on how to run a local node, see [hopr documentation](https://docs.hoprnet.org/en/latest/src/install-hoprd/index.html). To fully test MyneChat using HOPR nodes, you need to set up a local HOPR node cluster (needed to fully use MyneChat locally, see the [local cluster setup instructions](https://github.com/hoprnet/hoprnet/blob/master/SETUP_LOCAL_CLUSTER.md)).

To test MyneChat against production HOPR nodes, checkout the [tutorial](#tutorial). Be aware that for this to work, your HOPR node will need to have `wxHOPR` tokens from the Gnosis Chain network and have a few channels open. Additionally, you will need to know the `PeerId` of the HOPR node you want to talk to.

## Tutorial

In order to run MyneChat, a user has to setup MyneChat locally.
This tutorial shows how to set up MyneChat and a `hoprd` node locally.

1. You need to start a local `hoprd` node (at least v1.85.0). Multiple ways to do this are described in the [hoprd documentation](https://docs.hoprnet.org/en/latest/src/install-hoprd/index.html). For simplicity, use Docker and spin up a node locally using the `budapest` release:

```
docker run --pull always -p 3000:3000 -p 3001:3001 gcr.io/hoprassociation/hoprd:athens --apiToken ^MYtoken4testing^ --password hodlerATWORK --rest --admin --init
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
