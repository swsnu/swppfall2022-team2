"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var users = [];
var addUser = function (_a) {
    var id = _a.id, username = _a.username, room = _a.room;
    var user = { id: id, username: username, room: room, active: true };
    username = username === null || username === void 0 ? void 0 : username.trim().toLowerCase();
    room = room === null || room === void 0 ? void 0 : room.trim().toLowerCase();
    if (!username || !room)
        return { user: user, error: "Missing username or room name" };
    var existingUserInRoom = users.find(function (user) { return user.room === room && user.username === username; });
    if (existingUserInRoom) {
        if (existingUserInRoom.active === true) {
            return { user: user, error: "Username is already in use!" };
        }
        //if it's same user that had logged out:
        users.forEach(function (user) {
            return user.username === username ? (user.active = true) : user;
        });
        return { user: existingUserInRoom, error: "" };
    }
    //if it's a new user:
    users.push(user);
    return { user: user, error: "" };
};
exports.addUser = addUser;
var removeUser = function (id) {
    var anyActive = users.find(function (user) { return user.active === true; });
    //set the active status of this user in users to false:
    var foundUser = users.find(function (user) { return user.id === id; });
    var userIsNotActive = __assign(__assign({}, (foundUser || {})), { active: false });
    var newUsers = users === null || users === void 0 ? void 0 : users.map(function (user) {
        return user === foundUser ? userIsNotActive : user;
    });
    users = anyActive ? __spreadArrays(newUsers) : [];
    return { removedUser: anyActive ? foundUser : {} };
};
exports.removeUser = removeUser;
var getUser = function (username) {
    var foundUser = users.find(function (user) { return user.username === username; });
    if (!foundUser)
        return { error: "User " + username + " not found" };
    return { user: foundUser };
};
exports.getUser = getUser;
var getUsersInRoom = function (room) {
    var usersInRoom = users.filter(function (user) { return user.room === room; });
    return usersInRoom
        ? { users: usersInRoom, error: "" }
        : { users: [], error: "No users in this room!" };
};
exports.getUsersInRoom = getUsersInRoom;
var getTime = function () {
    var date = new Date(Date.now());
    return date.getHours() + ":" + ("0" + date.getMinutes()).slice(-2);
};
exports.getTime = getTime;
