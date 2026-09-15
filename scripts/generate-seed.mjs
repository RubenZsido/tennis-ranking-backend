/**
 * One-off helper: reads frontend mockPlayers.ts and writes players.seed.json.
 * Run from backend/: node scripts/generate-seed.mjs
 */
import { readFileSync, writeFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const tsPath = join(root, "../frontend/src/data/mockPlayers.ts");
const outPath = join(root, "src/data/players.seed.json");

const ts = readFileSync(tsPath, "utf8");
const marker = "const MOCK_PLAYERS";
const eq = ts.indexOf("=", ts.indexOf(marker));
const open = ts.indexOf("[", eq);
let depth = 0;
let close = open;
for (let i = open; i < ts.length; i++) {
  if (ts[i] === "[") depth++;
  if (ts[i] === "]") {
    depth--;
    if (depth === 0) {
      close = i + 1;
      break;
    }
  }
}

let arraySrc = ts.slice(open, close);
arraySrc = arraySrc.replace(/\bRANKING_AS_OF\b/g, "'2026-09-08'");
// eslint-disable-next-line no-new-func
const players = new Function(`return ${arraySrc}`)();
writeFileSync(outPath, `${JSON.stringify(players, null, 2)}\n`, "utf8");
console.log(`Wrote ${players.length} players to ${outPath}`);
