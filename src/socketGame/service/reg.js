import { checkExistUser } from "./checkExistUser.js";
import { getNewId } from "./getNewId.js";

export function reg(regData, socket) {
  if (checkExistUser(regData.name, this._players)) {
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
