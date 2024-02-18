import { getExistUser } from "./getExistUser.js";
import { getNewId } from "./getNewId.js";

export function reg(regData, socket) {
  const currentUser = getExistUser(regData, this._players);
  if (!currentUser) {
    const newUser = {
      socket,
      name: regData.name,
      password: regData.password,
      wins: 0,
      userID: getNewId(),
      game: {
        ships: null,
        shotPositions: [],
      },
      shipsAdded: false,
      id: 0,
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
    if (currentUser) {
      if (currentUser.password === regData.password) {
        currentUser.socket = socket;
        return {
          type: "reg",
          data: JSON.stringify({
            name: currentUser.name,
            index: currentUser.userID,
            error: false,
          }),
        };
      }
    }
    return {
      type: "reg",
      data: JSON.stringify({
        name: regData.name,
        index: -1,
        error: true,
        errorText: "Username or password is not correct!",
      }),
      id: 0,
    };
  }
}
