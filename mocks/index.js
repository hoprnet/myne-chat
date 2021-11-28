/*
  Run this file to get a simple mocked HOPRd instance
*/
const http = require("http");
const restana = require("restana");
const bodyParser = require("body-parser");
const { WebSocketServer } = require("ws");

const HTTP_PORT = 8080;
const WS_PORT = 8081;
const NODE_PEERID = "16Uiu2HAm1oEHkaUGk1TjGVGZqA7V1AaRKUEcxzaEqpTbpYVqPsMq";

// HTTP Server
const httpService = restana({
  errorHandler(err, req, res) {
    console.log(`HTTP server error: ${err.message || err}`);
    res.send(err);
  },
});

httpService
  .use(bodyParser.json({ type: "*/*" }))
  .use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    res.setHeader("Content-Type", "application/json");
    next();
  })
  .get("/info", (req, res) => {
    console.log("->", req.method, req.url);
    res.send({
      peerId: NODE_PEERID,
    });
  })
  .post("/send_message", (req, res) => {
    console.log("->", req.method, req.url, req.body);
    const { destination, message } = req.body;
    res.end();

    if (!ws) {
      console.log("HTTP server warn: no WS connection to client");
      return;
    }
    // response
    ws.send(`${destination}:message received "${message}"`);
  });

http.createServer(httpService).listen(HTTP_PORT, "localhost", () => {
  console.log(`HTTP server running at port ${HTTP_PORT}`);
});

// WS Server
const wss = new WebSocketServer({ host: "localhost", port: 8081 });
let ws;

wss.on("listening", () => {
  console.log(`WS server running at port ${WS_PORT}`);
});

wss.on("connection", function connection(_ws) {
  console.log("connection to WS server");
  ws = _ws;
});
