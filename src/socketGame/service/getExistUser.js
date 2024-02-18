export function getExistUser(login, array) {
  return array.find((v) => v.name === login.name);
}
