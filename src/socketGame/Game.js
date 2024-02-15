import { WebSocketServer } from "ws";
import { reg as regService } from "./service/reg.js";
import { createRoom } from "./service/roomWork.js";
import { Formatter } from "./Formatter.js";
import { getAllPositionOfShip } from "./service/getAllPositionOfShip.js";

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
    room.turnId = currentUser.userID;
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

  attack(attackData) {
    const currentRoom = this._rooms.find(
      (room) => room.indexRoom === attackData.gameId
    );

    if (currentRoom.turnId !== attackData.indexPlayer) return;

    const currentUser = currentRoom.players.find(
      (player) => player.userID === attackData.indexPlayer
    );
    const enemyUser = currentRoom.players.find(
      (player) => player.userID !== attackData.indexPlayer
    );
    const { x, y } = attackData;

    let [idOfShip, status] = [-1, "miss"];
    let nextTurnId = enemyUser.userID;

    for (let i = 0; i < enemyUser.game.ships.length; i++) {
      const ship = enemyUser.game.ships[i];
      const allPosOfShip = getAllPositionOfShip(
        ship.direction,
        ship.position.x,
        ship.position.y,
        ship.length
      );

      allPosOfShip.forEach((pos) => {
        if (pos.x === x && pos.y === y) {
          ship.hitsCount ? (ship.hitsCount += 1) : (ship.hitsCount = 1);
          idOfShip = i;
        }
      });

      if (idOfShip > -1) {
        if (ship.hitsCount === ship.length) {
          enemyUser.game.ships = enemyUser.game.ships.filter(
            (_, i) => i !== idOfShip
          );
          status = "killed";
          nextTurnId = currentUser.userID;
        } else {
          status = "shot";
          nextTurnId = currentUser.userID;
        }
        break;
      }
    }
    currentRoom.turnId = nextTurnId;
    currentRoom.players.forEach((player) => {
      const attackData = this._formatter.getAttackData(
        currentUser.userID,
        status,
        { x, y }
      );
      player.socket.send(JSON.stringify(attackData));
      player.socket.send(
        JSON.stringify(this._formatter.getTurnData(currentRoom.turnId))
      );
    });
  }

  finish(finishData) {}
  update_room() {
    return this._formatter.getUpdateRoomData();
  }
  add_ships(addShipsData) {
    const currentRoom = this._rooms.find(
      (room) => room.indexRoom === addShipsData.gameId
    );
    const currentUser = currentRoom.players.find(
      (player) => player.userID === addShipsData.indexPlayer
    );

    currentUser.game.ships = addShipsData.ships;
    currentUser.shipsAdded = true;

    if (currentRoom.players.every((player) => player.shipsAdded)) {
      const turn = currentUser.userID;
      this._currentTurnId = turn;
      currentRoom.players.forEach((player) => {
        player.socket.send(
          JSON.stringify(
            this._formatter.getStarteGameData(player.game.ships, player.userID)
          )
        );
        player.socket.send(JSON.stringify(this._formatter.getTurnData(turn)));
      });
    }
  }
}

export { Game };
