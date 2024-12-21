const WebSocket = require("ws");

function setupWebSocket(server) {
  const wss = new WebSocket.Server({ server });

  wss.on("connection", (ws) => {
    console.log("New WebSocket connection");

    ws.on("message", (message) => {
      console.log(`Received: ${message}`);
      ws.send(`Echo: ${message}`);
    });

    ws.on("close", () => {
      console.log("WebSocket connection closed");
    });

    ws.send("Welcome to the WebSocket server!");
  });
}

module.exports = { setupWebSocket };
