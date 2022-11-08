interface IUser {
  id?: string;
  username?: string;
  room?: string;
  active?: boolean;
}

interface IAnswer {
  user?: IUser;
  users?: IUser[];
  error?: string;
}

let users: IUser[] = [];

const addUser = ({ id, username, room }: IUser): IAnswer => {
  const user = { id, username, room, active: true };

  username = username?.trim().toLowerCase();
  room = room?.trim().toLowerCase();

  if (!username || !room)
    return { user, error: "Missing username or room name" };

  const existingUserInRoom: IUser | undefined = users.find(
    (user) => user.room === room && user.username === username
  );

  if (existingUserInRoom) {
    if (existingUserInRoom.active === true) {
      return { user, error: "Username is already in use!" };
    }
    //if it's same user that had logged out:
    users.forEach((user) =>
      user.username === username ? (user.active = true) : user
    );

    return { user: existingUserInRoom, error: "" };
  }

  //if it's a new user:
  users.push(user);

  return { user, error: "" };
};

const removeUser = (id: string): IAnswer | object => {
  const anyActive = users.find((user) => user.active === true);

  //set the active status of this user in users to false:
  const foundUser: IUser | undefined = users.find((user) => user.id === id);

  const userIsNotActive: IUser = {
    ...(foundUser || {}),
    active: false,
  };

  const newUsers: IUser[] | [] = users?.map((user) =>
    user === foundUser ? userIsNotActive : user
  );

  users = anyActive ? [...newUsers] : [];

  return { removedUser: anyActive ? foundUser : {} };
};

const getUser = (username: string): IAnswer => {
  const foundUser: IUser | undefined = users.find(
    (user) => user.username === username
  );
  if (!foundUser) return { error: `User ${username} not found` };

  return { user: foundUser };
};

const getUsersInRoom = (room: string): IAnswer => {
  const usersInRoom: IUser[] = users.filter((user) => user.room === room);

  return usersInRoom
    ? { users: usersInRoom, error: "" }
    : { users: [], error: "No users in this room!" };
};

const getTime = () => {
  const date = new Date(Date.now());
  return `${date.getHours()}:${("0" + date.getMinutes()).slice(-2)}`;
};

export { addUser, removeUser, getUser, getUsersInRoom, getTime };
