export function getAroundCeils(posOfShip, direction) {
  const sortedPosByDirection = posOfShip;
  const ceils = [];
  if (direction) {
    sortedPosByDirection.sort((a, b) => a.y - b.y);
    const onlyXPos = sortedPosByDirection.map((p) => p.y);
    const upMax = Math.max(...onlyXPos);
    const upMin = Math.min(...onlyXPos);

    if (upMin - 1 > -1 && upMax + 1 < 10) {
      ceils.push({ y: upMin - 1, x: posOfShip[0].x });
      ceils.push({ y: upMax + 1, x: posOfShip[0].x });
    } else if (upMin - 1 < 0) {
      ceils.push({ y: upMax + 1, x: posOfShip[0].x });
    } else {
      ceils.push({ y: upMin - 1, x: posOfShip[0].x });
    }

    for (let i = 0; i < sortedPosByDirection.length; i++) {
      const leftX = sortedPosByDirection[i].x - 1;
      const rightX = sortedPosByDirection[i].x + 1;

      if (leftX > -1 && rightX < 10) {
        if (i === 0 && upMin - 1 > -1) {
          ceils.push({ y: sortedPosByDirection[i].y - 1, x: leftX });
          ceils.push({ y: sortedPosByDirection[i].y - 1, x: rightX });
        }
        if (i + 1 === sortedPosByDirection.length && upMax + 1 < 10) {
          ceils.push({ y: sortedPosByDirection[i].y + 1, x: leftX });
          ceils.push({ y: sortedPosByDirection[i].y + 1, x: rightX });
        }
        ceils.push({ y: sortedPosByDirection[i].y, x: leftX });
        ceils.push({ y: sortedPosByDirection[i].y, x: rightX });
      } else if (leftX < 0) {
        if (i === 0 && upMin - 1 > -1)
          ceils.push({ y: sortedPosByDirection[i].y - 1, x: rightX });
        if (i + 1 === sortedPosByDirection.length && upMax + 1 < 10)
          ceils.push({ y: sortedPosByDirection[i].y + 1, x: rightX });
        ceils.push({ y: sortedPosByDirection[i].y, x: rightX });
      } else {
        if (i === 0 && upMin - 1 > -1)
          ceils.push({ y: sortedPosByDirection[i].y - 1, x: leftX });
        if (i + 1 === sortedPosByDirection.length && upMax + 1 < 10)
          ceils.push({ y: sortedPosByDirection[i].y + 1, x: leftX });
        ceils.push({ y: sortedPosByDirection[i].y, x: leftX });
      }
    }

    ceils.forEach((v) => (v.status = "miss"));

    return ceils;
  } else {
    sortedPosByDirection.sort((a, b) => a.x - b.x);
    const onlyXPos = sortedPosByDirection.map((p) => p.x);
    const upMax = Math.max(...onlyXPos);
    const upMin = Math.min(...onlyXPos);

    if (upMin - 1 > -1 && upMax + 1 < 10) {
      ceils.push({ x: upMin - 1, y: posOfShip[0].y });
      ceils.push({ x: upMax + 1, y: posOfShip[0].y });
    } else if (upMin - 1 < 0) {
      ceils.push({ x: upMax + 1, y: posOfShip[0].y });
    } else {
      ceils.push({ x: upMin - 1, y: posOfShip[0].y });
    }

    for (let i = 0; i < sortedPosByDirection.length; i++) {
      const leftX = sortedPosByDirection[i].y - 1;
      const rightX = sortedPosByDirection[i].y + 1;

      if (leftX > -1 && rightX < 10) {
        if (i === 0 && upMin - 1 > -1) {
          ceils.push({ x: sortedPosByDirection[i].x - 1, y: leftX });
          ceils.push({ x: sortedPosByDirection[i].x - 1, y: rightX });
        }
        if (i + 1 === sortedPosByDirection.length && upMax + 1 < 10) {
          ceils.push({ x: sortedPosByDirection[i].x + 1, y: leftX });
          ceils.push({ x: sortedPosByDirection[i].x + 1, y: rightX });
        }
        ceils.push({ x: sortedPosByDirection[i].x, y: leftX });
        ceils.push({ x: sortedPosByDirection[i].x, y: rightX });
      } else if (leftX < 0) {
        if (i === 0 && upMin - 1 > -1)
          ceils.push({ x: sortedPosByDirection[i].x - 1, y: rightX });
        if (i + 1 === sortedPosByDirection.length && upMax + 1 < 10)
          ceils.push({ x: sortedPosByDirection[i].x + 1, y: rightX });
        ceils.push({ x: sortedPosByDirection[i].x, y: rightX });
      } else {
        if (i === 0 && upMin - 1 > -1)
          ceils.push({ x: sortedPosByDirection[i].x - 1, y: leftX });
        if (i + 1 === sortedPosByDirection.length && upMax + 1 < 10)
          ceils.push({ x: sortedPosByDirection[i].x + 1, y: leftX });
        ceils.push({ x: sortedPosByDirection[i].x, y: leftX });
      }
    }

    ceils.forEach((v) => (v.status = "miss"));

    return ceils;
  }
}
