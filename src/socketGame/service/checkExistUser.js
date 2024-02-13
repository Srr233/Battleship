export function checkExistUser(login, array) {
  return !array.find((v) => v.name === login);
}
