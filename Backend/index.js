const express = require("express");
const cors = require("cors");
const http = require("http");
const { setupWebSocket } = require("./config/web-socket");
const database = require("./config/database");

const app = express();
const server = http.createServer(app); //  run the backend and websocket on same port

// importing route
const dishRoute = require("./routes/Dish");

// configuring dotenv to access .env file
const dotenv = require("dotenv");
dotenv.config();

const PORT = process.env.PORT || 4000;

// connecting database
database.connect();

// middleware
app.use(express.json());
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

// routes mount
app.use("/api/v1/dish", dishRoute);

// testing server route
app.get("/", (req, res) => {
  return res.json({
    success: true,
    message: "Your server is up and running...",
  });
});

// Setup WebSocket server
setupWebSocket(server);

// activating the server
server.listen(PORT, () => {
  console.log(`App is listening at ${PORT}`);
});
