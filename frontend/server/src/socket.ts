import { Server, Socket } from "socket.io";

const {
  VERIFY_USER,
  JOIN_CHAT,
  SEND_MESSAGE,
  TYPING,
  LOGOUT,
} = require("./socketEvents");

const {
  addUser,
  removeUser,
  getUser,
  getUsersInRoom,
  getTime,
} = require("./users");

interface IUser {
  username?: string;
  room?: string;
}

interface IMessage {
  id: string;
  time: string;
  text: string;
  emitter: string;
}

export default (io: Server) => {
  io.on("connect", (socket: Socket) => {
    socket.on(VERIFY_USER, ({ username, room }: IUser, callback: Function) => {
      const { error, user } = addUser({ id: socket.id, username, room });

      if (error) return callback({ error });
      return callback({ user });
    });


    socket.on(SEND_MESSAGE, ({ sender, messageToSend }, callback: Function) => {
      const { user, error } = getUser(sender.username);
      if (error) return callback(error);

      io.to(user.room).emit("message", {
        id: String(Math.random()),
        emitter: user.username,
        text: messageToSend,
        time: getTime(),
      });
    });

    function disconnect() {
      const { removedUser } = removeUser(socket.id);
      const usersInChat = removedUser && getUsersInRoom(removedUser.room);

      //if users in chat, let them know this user left:
      if (removedUser && usersInChat.users.length) {
        console.log("disconnecting y users:", { removedUser }, { usersInChat });
        io.to(removedUser.room).emit("message", {
          id: String(Math.random()),
          emitter: "admin",
          text: `${
            removedUser.username
          } has left from room ${removedUser.room.toUpperCase()}`,
          time: getTime(),
        });
        console.log("after logout: --->", usersInChat);

        io.to(removedUser.room).emit("roomData", usersInChat);
      }
    }

    socket.on(LOGOUT, () => {
      disconnect();
    });

    socket.on("disconnect", () => {
      disconnect();
    });
  });
};
