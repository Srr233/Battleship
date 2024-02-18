export function getPlayersAndRoom(rooms, gameId, indexPlayer) {
  const currentRoom = rooms.find((room) => room.indexRoom === gameId);
  const currentUser = currentRoom.players.find(
    (player) => player.userID === indexPlayer
  );
  const enemyUser = currentRoom.players.find(
    (player) => player.userID !== indexPlayer
  );
  return {
    currentRoom,
    currentUser,
    enemyUser,
  };
}
