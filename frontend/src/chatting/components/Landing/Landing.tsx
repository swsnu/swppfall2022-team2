import React, {
  FC,
  useState,
  useEffect,
  SyntheticEvent,
  ChangeEvent,
} from "react";
import { useNavigate} from "react-router-dom";
import { Socket } from "socket.io-client";
import { JOIN_CHAT, VERIFY_USER } from "../../../socketEvents";
import "./styles.scss";

interface LandingProps {
  socket?: Socket | null;
  setUser: Function;
  createNewSocket: Function;
}

interface ILoginData {
  username: string;
  room: string;
}

const Landing: FC<LandingProps> = (props) => {
  let history = useNavigate();
  const { socket, setUser, createNewSocket } = props;

  const [loginData, setLoginData] = useState<ILoginData>({
    username: localStorage.getItem("username") || "",
    room: localStorage.getItem("room") || "",
  });
  const [rememberMe, setRememberMe] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const onChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    if (!socket) createNewSocket();
  }, []);

  const remember = (): void => {
    if (typeof Storage !== "undefined") {
      if (rememberMe) {
        localStorage.setItem("username", loginData.username);
        localStorage.setItem("room", loginData.room);
      } else {
        localStorage.clear();
      }
    }
  };

  const setError = (message: string): void => {
    setTimeout(() => setErrorMessage(""), 2000);
    setErrorMessage(message);
  };

  const onSubmit = (e: SyntheticEvent): Promise<void> => {
    e.preventDefault();

    //make socket event asyncronously to validate fields in server-side:
    return new Promise((resolve, reject) => {
      if (!socket) {
        reject("no socket connection yet");
      } else {
        socket?.emit(VERIFY_USER, loginData, (response: any) => {
          if (response.error) {
            reject(response.error);
          } else {
            //resolve();
          }
        });
      }
    })
      .then((_) => {
        remember();
        setUser({
          username: loginData.username,
          room: loginData.room,
        });
        socket?.emit(JOIN_CHAT, loginData);
      })
      .then((_) => history("/chat"))
      .catch((err) => setError(err));
  };

  return (
    <div className="container">
      <header>
        <h1>Chat App</h1>
      </header>
      <form onSubmit={onSubmit}>
        <input
          className="input"
          type="text"
          name="username"
          value={loginData.username}
          placeholder="Write your username"
          onChange={onChange}
        />
        <input
          className="input"
          type="text"
          name="room"
          value={loginData.room}
          placeholder="Write a room name"
          onChange={onChange}
        />
        <label className="checkbox" htmlFor="rememberme">
          Remember Me
          <input
            id="rememberme"
            type="checkbox"
            value={rememberMe.toString()}
            onChange={(e) => setRememberMe(e.target.checked)}
          />
          <span className="checkmark"></span>
        </label>
        <p className="errorMessage">{errorMessage}</p>
        <input className="input" type="submit" value="Log In" />
      </form>
    </div>
  );
};

export default Landing;
