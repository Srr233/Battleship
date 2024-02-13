import { WebSocketServer } from "ws";
import { getNewId } from "./service/getNewId.js";
import { checkExistUser } from "./service/checkExistUser.js";

class Game {
  constructor() {
    const socketServer = new WebSocketServer({ port: 3000 });
    socketServer.on("connection", (socket) => {
      socket.on("message", (rawData) => {
        const data = JSON.parse(rawData.toString("utf-8"));
        const res = this[data.type](JSON.parse(data.data), socket);
        const jsonStringify = JSON.stringify(res);
        socket.send(jsonStringify);
      });
    });

    this._rooms = [];
    this._players = [];
  }

  reg(regData, socket) {
    if (checkExistUser(regData.name, this._players)) {
      const newUser = {
        userID: getNewId(),
        socket,
        ...regData,
      };
      this._players.push(newUser);
      return {
        type: "reg",
        data: JSON.stringify({
          name: newUser.name,
          index: newUser.userID,
          error: false,
        }),
      };
    } else {
      return {
        type: "reg",
        data: JSON.stringify({
          name: regData.name,
          index: -1,
          error: true,
          errorText: "Username already exists! Please, choose another one!",
        }),
        id: 0,
      };
    }
  }
  create_game(createGameData) {}
  start_game(startGameData) {}
  turn(turnData) {}
  attack(attackData) {}
  finish(finishData) {}
  update_room(updateRoomData) {}
  update_winners(updateWinnersData) {}
}

export { Game };
