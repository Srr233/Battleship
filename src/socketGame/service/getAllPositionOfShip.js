export function getAllPositionOfShip(direction, x, y, length) {
  const result = [];
  if (direction) {
    for (let i = 0; i < length; i++) {
      result.push({
        x: x,
        y: y + i,
      });
    }
  } else {
    for (let i = 0; i < length; i++) {
      result.push({
        x: x + i,
        y: y,
      });
    }
  }
  return result;
}
