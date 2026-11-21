// main.ts — entrypoint for the Twin Harbor make.fun entry (Node 22, stdlib only).
// Copies game/ and screenshots/ into the output directory and writes the
// dossier with buildDossier from vendor/makefun-game.ts, so the sealed
// scorer can reproduce dossier.json byte for byte.

import { cpSync, existsSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-game.ts';

const repoRoot = dirname(fileURLToPath(import.meta.url));
const outDir = process.env.MAKEFUN_OUTPUT_DIR || '/output';

function fail(message: string): never {
  console.error(`main.ts: ${message}`);
  process.exit(1);
}

const gameDir = join(repoRoot, 'game');
const shotsDir = join(repoRoot, 'screenshots');
if (!existsSync(gameDir)) fail(`game/ not found in ${repoRoot}`);
if (!existsSync(shotsDir)) fail(`screenshots/ not found in ${repoRoot}`);

// Prepare the output directory without ever removing the directory itself:
// the grader may run as an unprivileged user that can write inside the
// pre-created output directory but cannot delete the directory itself.
mkdirSync(outDir, { recursive: true });
for (const known of ['game', 'screenshots', 'dossier.json']) {
  // force: true tolerates entries that are not there yet.
  rmSync(join(outDir, known), { recursive: true, force: true });
}

cpSync(gameDir, join(outDir, 'game'), { recursive: true });
cpSync(shotsDir, join(outDir, 'screenshots'), { recursive: true });

const dossier = buildDossier(outDir, {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  game_max_files: 993,
  game_max_bytes: 50331648,
  game_path_max_bytes: 1000,
});
writeFileSync(join(outDir, 'dossier.json'), dossier);

console.log(`main.ts: wrote ${outDir} (game/, screenshots/, dossier.json)`);
