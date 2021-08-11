import { Socket, Server } from "socket.io";
import filter from "lodash/filter";

import GameManager from "../backgammon/model/manager";

import { Actions, Rooms } from "./constants";
import { NetworkStatus, SocketWithRole } from "./types";

export default class NetworkingManager {
  id: string;
  roomStatus: NetworkStatus = "NOT_STARTED";
  roomName: string;
  roomPasswordHash: string | undefined;
  server: Server | undefined;
  gameManager: GameManager | undefined;
  hostUsername: string;
  guestUsername: string | undefined;
  hostPlayer: Socket | undefined;
  guestPlayer: Socket | undefined;

  constructor(
    server: Server,
    id: string,
    hostPlayer: Socket,
    roomName: string,
    username: string,
    roomPasswordHash: string
  ) {
    this.id = id;
    this.server = server;
    this.hostPlayer = hostPlayer;
    this.roomName = roomName;
    this.hostUsername = username;
    this.roomPasswordHash = roomPasswordHash;

    this.hostRoom();
  }

  hostRoom() {
    if (!this.hostPlayer) {
      throw new Error("Cannot host, no player");
    }

    const { id, hostPlayer } = this;

    this.roomStatus = "WAITING_FOR_GUEST";

    hostPlayer.join([id, Rooms.PLAYERS]);
    hostPlayer.emit(Actions.ROOM_CREATED, {
      roomId: id,
      role: "HOST",
      hostUsername: this.hostUsername,
      status: this.roomStatus,
      roomName: this.roomName,
    });

    hostPlayer.on("disconnect", () => {
      this.roomStatus = "NOT_STARTED";
    });
  }

  getSocketsWithRole(): SocketWithRole[] {
    const entries: any = filter(
      [
        {
          role: "HOST",
          playerSocket: this.hostPlayer,
        },
        {
          role: "GUEST",
          playerSocket: this.guestPlayer,
        },
      ],
      (entry) => entry.playerSocket !== undefined
    );

    return entries;
  }

  initGameManager() {
    const { server, hostPlayer, guestPlayer, id } = this;

    if (!server || !hostPlayer || !guestPlayer || !id) {
      return;
    }

    this.gameManager = new GameManager(server, hostPlayer, guestPlayer, id);
  }

  joinPlayer(guest: Socket, guestUsername: string) {
    console.log("JOINING ROOM", this.id);

    this.guestPlayer = guest;
    this.guestUsername = guestUsername;
    this.guestPlayer.join([this.id, Rooms.PLAYERS]);

    this.roomStatus = "STARTED";

    if (!this.hostPlayer || !this.guestPlayer) {
      return;
    }

    const roomPayload = {
      roomId: this.id,
      hostUsername: this.hostUsername,
      guestUsername: this.guestUsername,
      status: this.roomStatus,
      roomName: this.roomName,
    };

    this.guestPlayer.emit(Actions.ROOM_JOINED, {
      ...roomPayload,
      role: "GUEST",
    });

    this.hostPlayer.emit(Actions.SYNC_NETWORK_STATUS, {
      ...roomPayload,
      role: "HOST",
    });

    this.initGameManager();
  }
}
