export function isAttackedPos(positions, currentPos) {
  return positions.find(
    (pos) => pos.x === currentPos.x && pos.y === currentPos.y
  );
}
