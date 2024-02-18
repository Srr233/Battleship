import { randomUUID } from "crypto";
export function getNewId() {
  return +randomUUID()
    .split("")
    .filter((v) => !isNaN(+v))
    .slice(0, 5)
    .join("");
}
