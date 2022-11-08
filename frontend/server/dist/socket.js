"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _a = require("./socketEvents"), VERIFY_USER = _a.VERIFY_USER, JOIN_CHAT = _a.JOIN_CHAT, SEND_MESSAGE = _a.SEND_MESSAGE, TYPING = _a.TYPING, LOGOUT = _a.LOGOUT;
var _b = require("./users"), addUser = _b.addUser, removeUser = _b.removeUser, getUser = _b.getUser, getUsersInRoom = _b.getUsersInRoom, getTime = _b.getTime;
exports.default = (function (io) {
    io.on("connect", function (socket) {
        socket.on(VERIFY_USER, function (_a, callback) {
            var username = _a.username, room = _a.room;
            var _b = addUser({ id: socket.id, username: username, room: room }), error = _b.error, user = _b.user;
            if (error)
                return callback({ error: error });
            return callback({ user: user });
        });
        socket.on(JOIN_CHAT, function (_a) {
            var username = _a.username, room = _a.room;
            socket.join(room);
            socket.emit("message", {
                id: String(Math.random()),
                emitter: "admin",
                text: username + ", welcome to room " + room.toUpperCase(),
                time: getTime(),
            });
            socket.to(room).emit("message", {
                id: String(Math.random()),
                emitter: "admin",
                text: username + " has joined!",
                time: getTime(),
            });
            io.to(room).emit("roomData", getUsersInRoom(room));
        });
        socket.on(SEND_MESSAGE, function (_a, callback) {
            var sender = _a.sender, messageToSend = _a.messageToSend;
            var _b = getUser(sender.username), user = _b.user, error = _b.error;
            if (error)
                return callback(error);
            io.to(user.room).emit("message", {
                id: String(Math.random()),
                emitter: user.username,
                text: messageToSend,
                time: getTime(),
            });
        });
        function disconnect() {
            var removedUser = removeUser(socket.id).removedUser;
            var usersInChat = removedUser && getUsersInRoom(removedUser.room);
            //if users in chat, let them know this user left:
            if (removedUser && usersInChat.users.length) {
                console.log("disconnecting y users:", { removedUser: removedUser }, { usersInChat: usersInChat });
                io.to(removedUser.room).emit("message", {
                    id: String(Math.random()),
                    emitter: "admin",
                    text: removedUser.username + " has left from room " + removedUser.room.toUpperCase(),
                    time: getTime(),
                });
                console.log("after logout: --->", usersInChat);
                io.to(removedUser.room).emit("roomData", usersInChat);
            }
        }
        socket.on(LOGOUT, function () {
            disconnect();
        });
        socket.on("disconnect", function () {
            disconnect();
        });
    });
});
