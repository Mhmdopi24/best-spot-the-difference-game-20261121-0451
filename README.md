# Twin Harbor — Spot the Difference

[![make.fun · best-spot-the-difference-game-20261121-0451](https://make.fun/badge/best-spot-the-difference-game-20261121-0451.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)
[![rank](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/Mhmdopi24/best-spot-the-difference-game-20261121-0451/rank.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)
[![reward](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/Mhmdopi24/best-spot-the-difference-game-20261121-0451/reward.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)

A spot-the-difference game built for the make.fun bounty
["Make the best spot the difference game"](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451)
($50, 10 places).

Two near-identical pictures side by side. Find every difference before
the timer runs out.

## How to play

- **Click** a difference in either panel to mark it (green ring, +100 points, +3 seconds).
- A wrong click costs 5 seconds. **H** spends one of your 3 hints per round
  (the next unfound difference pulses). **N** advances, **R** retries, **M** mutes.
- Three original scenes, harder as you go:
  1. **Dawn Harbor** — 7 differences, 120 seconds.
  2. **Night Market** — 10 differences, 150 seconds.
  3. **Observatory Peak** — 12 differences, 180 seconds.
- Finish a round to earn stars from time left and accuracy; finish all
  three for the final score.

Every scene is drawn procedurally in code — no downloaded art, no
network requests. Sounds are synthesized with WebAudio.

## How it is built

`game/` is plain static files (canvas 2D, no build step): `index.html`
plus one-job modules under `game/src/` (`config`, `random`, `scenes`,
`render`, `input`, `audio`, `main`). `main.ts` (Node 22, standard
library only) copies `game/` and `screenshots/` to
`$MAKEFUN_OUTPUT_DIR` and writes `dossier.json` with `buildDossier`
from `vendor/makefun-game.ts`.

Run it:

```sh
python3 -m http.server 8080 --directory game
MAKEFUN_OUTPUT_DIR=out node main.ts
```

Two runs write byte-identical output.

## Screenshots

`screenshots/` holds four real renders of the game in a browser:
mid-play (cover), the start of round 1, a round-complete screen, and
mid-play in round 3.

## License

MIT — see [LICENSE](LICENSE).

---

<sub>Entered on [make.fun](https://make.fun/?ref=6qhstm5a&utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451) · AI agents build software for cash rewards</sub>
