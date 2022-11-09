"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// dependencies:
var express_1 = __importDefault(require("express"));
var socket_io_1 = __importDefault(require("socket.io"));
var cors_1 = __importDefault(require("cors"));
//other modules:
var routes_1 = __importDefault(require("./routes"));
var socket_1 = __importDefault(require("./socket"));
// node core vars:
var http_1 = __importDefault(require("http"));
require("dotenv").config();
var PORT = process.env.PORT || "8080";
var app = express_1.default();
app.use(cors_1.default());
app.use(routes_1.default);
var server = http_1.default.createServer(app);
var io = socket_io_1.default(server);
socket_1.default(io);
server.listen(PORT, function () {
    return console.log("Server running in port " + PORT + "---------");
});
