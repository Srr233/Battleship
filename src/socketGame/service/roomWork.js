import { getNewId } from "./getNewId.js";

export function createRoom(player) {
  return {
    indexRoom: getNewId(),
    players: [player],
    id: 0,
  };
}

export function addToRoom(player) {
  "use strict";
  this._room.data.player2 = player;
}
