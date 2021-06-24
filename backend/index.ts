import express from "express";
import cors from "cors";
import http from "http";
import { Server, Socket } from "socket.io";
import { filter, map } from "lodash";
import GameManager from "./networking";
import { Actions } from "./networking/constants";
import { Room } from "./networking/types";

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

app.get("/", (req, res) => {
  res.send("PONG KICO");
});

app.get("/game", (req, res) => {
  res.send({
    hello: "zdravo",
  });
});

export const getUniqueId = () => "_" + Math.random().toString(36).substr(2, 9);

//TODO: put this somewhere else

const managers: GameManager[] = [];

const getPendingRoomsFromManagers = (managers: GameManager[]): Room[] =>
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
    const rooms = getPendingRoomsFromManagers(managers);

    socket.emit(Actions.ROOMS_FETCHED, {
      rooms,
    });
  });

  socket.on(Actions.CREATE_ROOM, (payload: any) => {
    const id = getUniqueId();
    const { roomName, username } = payload;

    const game_manager = new GameManager(io, id, socket, roomName, username);
    console.log("room created druga e", id);
    managers.push(game_manager);
  });

  socket.on(Actions.JOIN_ROOM, ({ roomId }: any) => {
    const gameManager = managers.find((it) => it.id === roomId);

    if (gameManager) {
      gameManager.joinPlayer(socket);
    }
  });
});

server.listen(PORT, () => {
  console.log(`The application is listening on port ${PORT}!`);
});
