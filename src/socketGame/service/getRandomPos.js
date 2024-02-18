export function getRandomPos(shotPositions) {
  while (true) {
    const x = Math.trunc(Math.random() * 10);
    const y = Math.trunc(Math.random() * 10);

    const isX = shotPositions.find((positions) => positions.x === x);
    const isY = shotPositions.find((positions) => positions.y === y);

    if (isX && isY) continue;

    return { x, y };
  }
}
