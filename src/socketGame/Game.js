import { WebSocketServer } from "ws";
import { reg as regService } from "./service/reg.js";
import { createRoom } from "./service/roomWork.js";
import { Formatter } from "./Formatter.js";

class Game {
  constructor() {
    const socketServer = new WebSocketServer({ port: 3000 });
    socketServer.on("connection", (socket) => {
      socket.on("message", (rawData) => {
        const data = JSON.parse(rawData.toString("utf-8"));

        if (data.data) {
          this[data.type](JSON.parse(data.data), socket, this);
        } else {
          this[data.type]("", socket);
        }
      });
    });

    this._players = [];
    this._rooms = [];
    this._formatter = new Formatter(this);
  }

  sendToAll(type, userID) {
    const dataToSend = [
      this._formatter.getUpdateWinnersData(),
      this._formatter.getUpdateRoomData(),
    ];

    this._players.forEach((user) => {
      dataToSend.forEach((data) => {
        if (type === "create_room" && userID) {
          if (userID !== user.userID) {
            user.socket.send(JSON.stringify(data));
          }
        } else {
          user.socket.send(JSON.stringify(data));
        }
      });
    });
  }

  reg(regData, socket) {
    socket.send(JSON.stringify(regService.call(this, regData, socket)));
    this.sendToAll();
  }
  create_room(_, socket) {
    const currentUser = this._players.find((user) => user.socket === socket);
    const room = createRoom(currentUser);
    this._rooms.push(room);
    this.sendToAll("create_room", currentUser.userID);
  }
  add_user_to_room({ indexRoom }, socket) {
    const currentRoom = this._rooms.find(
      (room) => room.indexRoom === indexRoom
    );
    const currentUser = this._players.find((user) => user.socket === socket);
    currentRoom.players.push(currentUser);

    currentRoom.started = true;
    this.sendToAll();
    currentRoom.players.forEach((user) => {
      user.socket.send(
        JSON.stringify(this._formatter.getCreateGameData(user, currentRoom))
      );
    });
  }
  start_game(startGameData) {
    console.log("hehe");
  }
  turn(turnData) {}
  attack(attackData) {}
  finish(finishData) {}
  update_room() {
    return this._formatter.getUpdateRoomData();
  }
  update_winners(updateWinnersData) {
    return {
      type: "update_winners",
      data: JSON.stringify([
        {
          name: "me",
          wins: 2,
        },
      ]),
      id: 0,
    };
  }
  add_ships(addShipsData) {
    const currRoom = this._room;

    if (currRoom.data.shipsPlayer1.userID === addShipsData.indexPlayer) {
      currRoom.data.shipsPlayer1.ships = addShipsData.ships;
    } else {
      currRoom.data.shipsPlayer2.ships = addShipsData.ships;
    }
    if (currRoom.data.shipsPlayer2?.ships && currRoom.data.shipsPlayer1.ships) {
      const dataPlayer1 = {
        type: "start_game",
        data: JSON.stringify({
          ships: addShipsData.ships,
          currentPlayerIndex: currRoom.player1.userID,
        }),
        id: 0,
      };
      const dataPlayer2 = {
        type: "start_game",
        data: JSON.stringify({
          ships: addShipsData.ships,
          currentPlayerIndex: currRoom.player2.userID,
        }),
        id: 0,
      };
      currRoom.player1.send(JSON.stringify(dataPlayer1));
      currRoom.player2.send(JSON.stringify(dataPlayer2));
    }
  }
}

export { Game };
