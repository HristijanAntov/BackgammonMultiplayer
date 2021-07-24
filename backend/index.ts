import express from "express";
import cors from "cors";
import http from "http";
import { Server, Socket } from "socket.io";
import { filter, map } from "lodash";
import NetworkingManager from "./networking";
import { Actions, Errors } from "./networking/constants";
import { IError, Room } from "./networking/types";

import { getUniqueId, generateError } from "./utils";
import { hashPassword, doesPasswordMatchHash } from "./utils/security-utils";

// import { play } from "./test-sim";

// play();

const PORT = 3001;

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.get("/ping", (req, res) => {
  res.send("PONG KICO");
});

//TODO: put this somewhere else

const networkManagers: NetworkingManager[] = [];

const getPendingRoomsFromManagers = (managers: NetworkingManager[]): Room[] =>
  map(
    filter(managers, (m) => m.roomStatus === "WAITING_FOR_GUEST"),
    (m) => ({
      id: m.id,
      name: m.roomName,
      hostedBy: m.hostUsername,
    })
  );

io.on("connection", (socket: Socket) => {
  socket.on(Actions.GET_ROOMS, () => {
    const rooms = getPendingRoomsFromManagers(networkManagers);

    socket.emit(Actions.ROOMS_FETCHED, {
      rooms,
    });
  });

  socket.on(Actions.CREATE_ROOM, async (payload: any) => {
    const id = getUniqueId();
    const { roomName, username: hostUsername, password } = payload;

    console.log("PLAYER WANTS TO CREATE A ROOM", roomName, hostUsername);

    try {
      const hashedPassword = await hashPassword(password);

      const networkManager = new NetworkingManager(
        io,
        id,
        socket,
        roomName,
        hostUsername,
        hashedPassword
      );

      networkManagers.push(networkManager);
    } catch (err) {
      console.log(err);
      //TODO: Report error to frontend somehow
    }
  });

  socket.on(Actions.JOIN_ROOM, async (payload: any) => {
    const { roomId, username, password } = payload;

    console.log("PLAYER WANTS TO JOIN A ROOM", roomId, username);

    const networkManager = networkManagers.find((it) => it.id === roomId);

    if (!networkManager) {
      console.log(`Couldn't find room with id ${roomId} `);
      return;
    }

    try {
      const { roomPasswordHash } = networkManager;

      if (!roomPasswordHash) {
        const error = generateError(Errors.PASSWORD_NOT_PRESENT, {
          roomName: networkManager.roomName,
          roomId: networkManager.id,
        });

        throw error;
      }

      const isPasswordValid = await doesPasswordMatchHash(
        roomPasswordHash,
        password
      );

      if (!isPasswordValid) {
        const error = generateError(Errors.PASSWORD_NOT_VALID, {
          roomName: networkManager.roomName,
          roomId: networkManager.id,
        });

        throw error;
      }

      if (isPasswordValid) {
        networkManager.joinPlayer(socket, username);
      }
    } catch (err) {
      const error = err as IError;

      //TODO: Report error to frontend somehow

      socket.emit(Actions.ERROR_OCCURRED, error);
    }
  });
});

server.listen(PORT, () => {
  console.log(`The application is listening on port ${PORT}!`);
});
