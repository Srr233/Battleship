import { getNewId } from "./getNewId.js";

export function createRoom(player) {
  return {
    indexRoom: getNewId(),
    players: [player],
    id: 0,
    started: false,
    turnId: null,
  };
}
