import { Socket, Server } from "socket.io";
import filter from "lodash/filter";
import map from "lodash/map";
import get from "lodash/get";

import Backgammon from "./index";

import {
  DiceRolledResult,
  GameState,
  MoveTransactionEntry,
  PlayerType,
  PositionTransition,
} from "../types";

import { Actions, RolePlayerMap, Rooms } from "../../networking/constants";
import {
  SocketWithRole,
  DiceRolledMetadata,
  ExecuteRollPayload,
} from "../../networking/types";

export default class GameManager {
  server: Server | undefined;
  game: Backgammon | undefined;
  hostPlayer: Socket | undefined;
  guestPlayer: Socket | undefined;
  roomId: string | undefined;

  constructor(
    server: Server,
    hostPlayer: Socket,
    guestPlayer: Socket,
    roomId: string
  ) {
    this.server = server;
    this.hostPlayer = hostPlayer;
    this.guestPlayer = guestPlayer;
    this.roomId = roomId;
    this.initGame();
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

    server.to(Rooms.PLAYERS).emit(Actions.EXECUTE_ROLL, result);
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

    server.to(Rooms.PLAYERS).emit(Actions.GAME_STARTED, {
      status: true,
      initState: game.getState(),
    });
  }

  initGame() {
    this.game = new Backgammon();
    this.initGameEvents();
  }
}
