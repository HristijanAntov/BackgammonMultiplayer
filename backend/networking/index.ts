import { Socket, Server } from "socket.io";
import filter from "lodash/filter";
import map from "lodash/map";
import get from "lodash/get";

import Backgammon from "../backgammon/model";
import {
  DiceRolledResult,
  GameState,
  MoveTransactionEntry,
  PlayerType,
  PositionTransition,
} from "../backgammon/types";

import { Actions, Rooms, RolePlayerMap } from "./constants";
import {
  NetworkStatus,
  SocketWithRole,
  DiceRolledMetadata,
  ExecuteRollPayload,
} from "./types";

export default class GameManager {
  id: string;
  roomStatus: NetworkStatus = "NOT_STARTED";
  roomName: string;
  server: Server | undefined;
  game: Backgammon | undefined;
  hostUsername: string;
  guestUsername: string | undefined;
  hostPlayer: Socket | undefined;
  guestPlayer: Socket | undefined;
  supervisors: Socket[] = [];

  constructor(
    server: Server,
    id: string,
    hostPlayer: Socket,
    roomName: string,
    username: string
  ) {
    this.id = id;
    this.server = server;
    this.hostPlayer = hostPlayer;
    this.roomName = roomName;
    this.hostUsername = username;

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
    });

    hostPlayer.on("disconnect", () => {
      this.roomStatus = "NOT_STARTED";
      //TODO: Host disconnect shall kill the room
    });
  }

  handleRoll(player: PlayerType) {
    const { hostPlayer, guestPlayer, server, game } = this;

    if (!hostPlayer || !guestPlayer || !server || !game) {
      return;
    }

    const rollResult = game.rollDice(player);

    if (rollResult === undefined) {
      return;
    }

    const { consequences, diceRolledInfo } = rollResult;

    const stateAfterRoll = { ...game.getState() };

    const diceRolledMetadata: DiceRolledMetadata[] = map(
      diceRolledInfo.rolledDice,
      (die, nth) => ({
        player: diceRolledInfo.player,
        die,
        nthDie: nth,
      })
    );

    const result: ExecuteRollPayload = {
      diceRolledMetadata,
      consequences,
      state: stateAfterRoll,
    };

    server.to(this.id).emit(Actions.EXECUTE_ROLL, result);
  }

  getPlayersSockets(): Socket[] {
    return filter(
      [this.hostPlayer, this.guestPlayer],
      (s) => s !== undefined
    ) as Socket[];
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

  applyMoveSequence(payload: PositionTransition, playerSocket: Socket) {
    const { game } = this;

    if (game === undefined) {
      return;
    }

    const moves = game.pickMoveByPositionTransition(payload) || [];
    const transactionEntries: MoveTransactionEntry[] = [];

    for (let i = 0; i < moves.length; i++) {
      game.move(moves[i]);
      const newState = game.getState();

      transactionEntries.push({
        move: moves[i],
        state: newState as GameState,
      });
    }

    playerSocket.emit(Actions.EXECUTE_MOVE, {
      transactionEntries,
    });
  }

  initGameEvents() {
    const { hostPlayer, guestPlayer, server, game } = this;

    if (!hostPlayer || !guestPlayer || !server || !game) {
      return;
    }

    const socketsWithRole = this.getSocketsWithRole();

    socketsWithRole.forEach((entry) => {
      const { role, playerSocket } = entry;
      const player: PlayerType = RolePlayerMap[role];

      playerSocket.on(Actions.INIT_ROLL, () => {
        this.handleRoll(player);
      });

      playerSocket.on(Actions.ROLL, () => {
        this.handleRoll(player);
      });

      playerSocket.on(Actions.MOVE, (payload: PositionTransition) => {
        this.applyMoveSequence(payload, playerSocket);
      });

      playerSocket.on(Actions.UNDO_MOVE, () => {
        game.undo();
        const updatedState = game.getState();
        playerSocket.emit(Actions.SYNC_STATE, {
          state: updatedState,
        });
      });

      playerSocket.on(Actions.CONFIRM_MOVE, () => {
        const pendingMoveTransactionEntries = game.confirmMove();
        const updatedState = game.getState();

        playerSocket.emit(Actions.SYNC_STATE, {
          state: updatedState,
        });

        const opponentSocket = socketsWithRole.find(
          (it) => it.role !== role
        )?.playerSocket;

        if (opponentSocket === undefined) {
          return;
        }

        const transactionEntriesReplayed: MoveTransactionEntry[] =
          pendingMoveTransactionEntries.map((entry) => ({
            move: entry.move,
            state: entry.nextState,
          }));

        opponentSocket.emit(Actions.EXECUTE_MOVE, {
          transactionEntries: transactionEntriesReplayed,
          finalState: updatedState,
        });
      });
    });

    console.log("I CREATE GAME EVENTS and started game");

    server.to(this.id).emit(Actions.GAME_STARTED, {
      status: true,
      initState: game.getState(),
    });
  }

  initGame() {
    this.game = new Backgammon();
    this.initGameEvents();
  }

  joinPlayer(visitor: Socket) {
    console.log("JOINING ROOM", this.id);
    if (this.guestPlayer) {
      this.supervisors.push(visitor);
      visitor.join([this.id, Rooms.SUPERVISORS]);
      return;
    }

    this.guestPlayer = visitor;
    this.guestPlayer.join([this.id, Rooms.PLAYERS]);

    this.roomStatus = "STARTED";
    this.guestPlayer.emit("ROOM_JOINED", {
      roomId: this.id,
      role: "GUEST",
      hostUsername: this.hostUsername,
      guestUsername: this.guestUsername,
      status: this.roomStatus,
    });

    this.initGame();
  }
}
