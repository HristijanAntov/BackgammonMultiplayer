import { Socket, Server } from "socket.io";
import filter from "lodash/filter";
import map from "lodash/map";

import Backgammon from "./index";
import { Actions, RolePlayerMap, Rooms } from "../../networking/constants";
import {
  MoveTransactionEntry,
  PlayerType,
  PositionTransition,
  WinResult,
} from "../types";

import {
  SocketWithRole,
  DiceRolledMetadata,
  ExecuteRollPayload,
} from "../../networking/types";
import { getOpponent } from "../utils";

export type RematchAcceptanceStatus = "PENDING" | "IDLE";

export interface RematchState {
  pendingInvitationFromPlayer: PlayerType | undefined;
  rematchAcceptance: RematchAcceptanceStatus;
}

const initRematchState = (): RematchState => ({
  pendingInvitationFromPlayer: undefined,
  rematchAcceptance: "IDLE",
});

export default class GameManager {
  server: Server | undefined;
  game: Backgammon | undefined;
  hostPlayer: Socket | undefined;
  guestPlayer: Socket | undefined;
  roomId: string | undefined;

  rematchState: RematchState = initRematchState();

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

  applyMoveSequence(
    payload: PositionTransition,
    playerSocket: Socket,
    opponentSocket: Socket
  ) {
    const { game } = this;

    if (game === undefined) {
      return;
    }

    const moves = game.pickMoveByPositionTransition(payload) || [];
    const transactionEntries: MoveTransactionEntry[] = [];
    let winResult: WinResult | undefined;

    for (let i = 0; i < moves.length; i++) {
      winResult = game.move(moves[i]);

      const newState = game.getState();

      transactionEntries.push({
        move: moves[i],
        state: newState,
      });

      if (winResult.isWin) {
        break;
      }
    }

    playerSocket.emit(Actions.EXECUTE_MOVE, {
      transactionEntries,
    });

    if (winResult?.isWin) {
      this.confirmMove(playerSocket, opponentSocket, game, true);
    }
  }

  confirmMove(
    playerSocket: Socket,
    opponentSocket: Socket | undefined,
    game: Backgammon,
    isAutoConfirm = false
  ) {
    const pendingMoveTransactionEntries = game.confirmMove();
    const updatedState = game.getState();

    console.log(game.getState().stateMachine, "EVE VO CONFIRM");

    if (!isAutoConfirm) {
      playerSocket.emit(Actions.SYNC_STATE, {
        state: updatedState,
      });
    }

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
  }

  canRespondToRematchInvitation(player: PlayerType) {
    const { rematchState, game } = this;
    const gameState = game?.getState();

    const canRespond =
      gameState &&
      gameState.stateMachine === "WIN" &&
      rematchState.pendingInvitationFromPlayer === getOpponent(player) &&
      rematchState.rematchAcceptance === "PENDING";

    return canRespond;
  }

  handleRematchAcceptance(player: PlayerType, action: "ACCEPT" | "DECLINE") {
    const { server } = this;
    const canRespond = this.canRespondToRematchInvitation(player);

    if (server === undefined) {
      return;
    }

    if (canRespond) {
      this.rematchState = initRematchState();
      this.initGameInstance();

      const { game } = this;

      if (action === "ACCEPT") {
        server.to(Rooms.PLAYERS).emit(Actions.GAME_STARTED, {
          status: true,
          initState: game?.getState(),
        });
      }

      if (action === "DECLINE") {
        server.to(Rooms.PLAYERS).emit(Actions.REMATCH_INVITATION_DECLINED, {});
      }
    }
  }

  initGameEvents() {
    const { hostPlayer, guestPlayer, server } = this;

    if (!hostPlayer || !guestPlayer || !server) {
      return;
    }

    const socketsWithRole = this.getSocketsWithRole();

    socketsWithRole.forEach((entry) => {
      const { role, playerSocket } = entry;
      const player: PlayerType = RolePlayerMap[role];

      const opponentSocket = socketsWithRole.find(
        (it) => it.role !== role
      )?.playerSocket;

      playerSocket.on(Actions.INIT_ROLL, () => {
        this.handleRoll(player);
      });

      playerSocket.on(Actions.ROLL, () => {
        this.handleRoll(player);
      });

      playerSocket.on(Actions.MOVE, (payload: PositionTransition) => {
        if (opponentSocket === undefined) {
          console.log("Opponent is not present");
          return;
        }

        this.applyMoveSequence(payload, playerSocket, opponentSocket);
      });

      playerSocket.on(Actions.UNDO_MOVE, () => {
        const { game } = this;

        if (game === undefined) {
          return;
        }

        game.undo();
        const updatedState = game.getState();
        playerSocket.emit(Actions.SYNC_STATE, {
          state: updatedState,
        });
      });

      playerSocket.on(Actions.CONFIRM_MOVE, () => {
        const { game } = this;

        if (game === undefined) {
          return;
        }

        this.confirmMove(playerSocket, opponentSocket, game);
      });

      playerSocket.on(Actions.INVITE_FOR_REMATCH, () => {
        const { rematchState, game } = this;
        const gameState = game?.getState();

        const canInvite =
          gameState &&
          gameState.stateMachine === "WIN" &&
          rematchState.pendingInvitationFromPlayer === undefined;

        if (canInvite) {
          this.rematchState = {
            ...rematchState,
            pendingInvitationFromPlayer: player,
            rematchAcceptance: "PENDING",
          };

          opponentSocket?.emit(Actions.REMATCH_INVITATION_SENT, {});
        }
      });

      playerSocket.on(Actions.ACCEPT_REMATCH, () => {
        this.handleRematchAcceptance(player, "ACCEPT");
      });

      playerSocket.on(Actions.DECLINE_REMATCH, () => {
        this.handleRematchAcceptance(player, "DECLINE");
      });
    });

    console.log("I CREATE GAME EVENTS and started game");

    server.to(Rooms.PLAYERS).emit(Actions.GAME_STARTED, {
      status: true,
      initState: this.game?.getState(),
    });
  }

  initGame() {
    this.initGameInstance();
    this.initGameEvents();
  }

  initGameInstance() {
    this.game = new Backgammon();
  }
}
