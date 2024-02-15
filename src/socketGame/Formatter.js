export class Formatter {
  constructor(game) {
    this.game = game;
  }

  getCreateGameData(currentUser, room) {
    const createGameData = {
      type: "create_game",
      data: JSON.stringify({
        idGame: room.indexRoom,
        idPlayer: currentUser.userID,
      }),
      id: 0,
    };

    return createGameData;
  }

  getUpdateRoomData() {
    const roomsData = this.game._rooms
      .map((room) => {
        if (!room.started) {
          return {
            roomId: room.indexRoom,
            roomUsers: room.players.map((user) => ({
              name: user.name,
              index: user.userID,
            })),
          };
        }
      })
      .filter((r) => r);
    return {
      type: "update_room",
      data: JSON.stringify(roomsData),
      id: 0,
    };
  }

  getUpdateWinnersData() {
    return {
      type: "update_winners",
      data: JSON.stringify(
        this.game._players.map((user) => ({
          name: user.name,
          wins: user.wins,
        }))
      ),
      id: 0,
    };
  }

  getStarteGameData(ships, userId) {
    return {
      type: "start_game",
      data: JSON.stringify({
        ships,
        currentPlayerIndex: userId,
      }),
      id: 0,
    };
  }

  getTurnData(userId) {
    return {
      type: "turn",
      data: JSON.stringify({
        currentPlayer: userId,
      }),
      id: 0,
    };
  }

  getAttackData(userId, status, position) {
    return {
      type: "attack",
      data: JSON.stringify({
        position,
        currentPlayer: userId,
        status: status,
      }),
      id: 0,
    };
  }
}
