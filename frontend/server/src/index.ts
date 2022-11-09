// dependencies:
import express, { Application } from "express";
import socketIO from "socket.io";
import cors from "cors";
//other modules:
import router from "./routes";
import initializeSocketIO from "./socket";
// node core vars:
import http from "http";

require("dotenv").config();

const PORT: string = process.env.PORT || "8080";

const app: Application = express();
app.use(cors());
app.use(router);

const server = http.createServer(app);

const io = socketIO(server);

initializeSocketIO(io);

server.listen(PORT, () =>
  console.log(`Server running in port ${PORT}---------`)
);
