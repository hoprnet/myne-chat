/*
  Run this file to get a simple mocked HOPRd instance.
*/
const http = require("http");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { WebSocketServer } = require("ws");

const HTTP_PORT = 3001;
const WS_PORT = 3000;
const NODE_PEERID = "16Uiu2HAm1oEHkaUGk1TjGVGZqA7V1AaRKUEcxzaEqpTbpYVqPsMq";

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
  .get("/api/v2/account/address", (req, res) => {
    console.log("->", req.method, req.url);
    res.send({
      hoprAddress: NODE_PEERID,
    });
  })
  .post("/api/v2/messages", (req, res) => {
    console.log("->", req.method, req.url, req.body);
    const { recipient, body } = req.body;
    res.end();

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

http.createServer(httpService).listen(HTTP_PORT, "localhost", () => {
  console.log(`HTTP server running at port ${HTTP_PORT}`);
});

// WS Server
const wss = new WebSocketServer({ host: "localhost", port: WS_PORT });
let ws;

wss.on("listening", () => {
  console.log(`WS server running at port ${WS_PORT}`);
});

wss.on("connection", function connection(_ws) {
  console.log("connection to WS server");
  ws = _ws;
});
