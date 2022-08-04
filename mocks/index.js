/*
  Run this file to get a simple mocked HOPRd instance.
*/
const http = require("http");
const express = require("express");
const cors = require("cors");
const { randomBytes } = require("crypto");
const bodyParser = require("body-parser");
const { WebSocketServer } = require("ws");
const { privKeyToPeerId, u8aToHex } = require("@hoprnet/hopr-utils");

const API_PORT = 3001;
const privateKey =
  "0xcb1e5d91d46eb54a477a7eefec9c87a1575e3e5384d38f990f19c09aa8ddd332";
const mockMyPeerId = privKeyToPeerId(privateKey);
const MY_NODE_PEER_ID = mockMyPeerId.toB58String();
const mockThemPeerId = privKeyToPeerId(randomBytes(32));
const THEM_NODE_PEER_ID = mockThemPeerId.toB58String();

// HTTP Server
const httpService = express({
  errorHandler(err, req, res) {
    console.log(`HTTP server error: ${err.message || err}`);
    res.send(err);
  },
});

httpService
  .use(bodyParser.json({ type: "*/*" }))
  .use(cors())
  .get("/mocks/status", async (req, res) => {
    console.log("->", req.method, req.url);
    res.send({
      status: ws ? "connected" : "disconnected",
    });
  })
  .post("/mocks/sendRandomMessage", async (req, res) => {
    console.log("->", req.method, req.url);
    res.end();
    ws &&
      ws.send(
        JSON.stringify({
          type: "message",
          msg: `myne:${MY_NODE_PEER_ID}: Random Message`,
        })
      );
  })
  .get("/api/v2/account/addresses", (req, res) => {
    console.log("->", req.method, req.url);
    res.send({
      hoprAddress: MY_NODE_PEER_ID,
    });
  })
  .post("/api/v2/message/sign", async (req, res) => {
    console.log("->", req.method, req.url, req.body);
    const { message } = req.body;
    res.send({
      signature: u8aToHex(
        await mockMyPeerId.privKey.sign(
          new TextEncoder().encode("HOPR Signed Message: " + message)
        )
      ),
    });
  })
  .post("/api/v2/messages", (req, res) => {
    console.log("->", req.method, req.url, req.body);
    const { recipient, body } = req.body;
    res.status(204).end();

    if (!ws) {
      console.log("HTTP server warn: no WS connection to client");
      return;
    }

    // respond to client
    ws.send(
      JSON.stringify({
        type: "message",
        msg: `myne:${recipient}:mocked server has recevied "${body}" message`,
      })
    );
  });

const server = http.createServer(httpService);
const wss = new WebSocketServer({
  noServer: true,
});
// WS Server
let ws;

server.on("upgrade", function upgrade(req, socket, head) {
  // upgrade to WS protocol
  wss.handleUpgrade(req, socket, head, function done(socket_) {
    wss.emit("connection", socket_, req);
  });
});

wss.on("connection", function connection(_ws) {
  console.log("connection to WS server");
  ws = _ws;
});

server.listen(API_PORT, "localhost", () => {
  console.log(`HTTP server running at port ${API_PORT}`);
});

server
  .listen(API_PORT, () => {
    console.log(`API server on port ${API_PORT}`);
  })
  .on("error", (err) => {
    console.log(`Failed to start API server: ${err}`);
  });
