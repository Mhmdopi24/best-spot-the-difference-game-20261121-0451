// config.js — constants for Twin Harbor: rounds, timing, scoring, panel geometry.
// Every number that tunes play lives here so the other modules stay dumb.

export const PANEL_W = 600;
export const PANEL_H = 560;
export const PANEL_Y = 20;
export const PANEL_LEFT_X = 20;
export const PANEL_RIGHT_X = 660;
export const CANVAS_W = 1280;
export const CANVAS_H = 600;

export const POINTS_PER_FIND = 100;
export const TIME_BONUS_PER_FIND = 3; // seconds added on a correct find
export const TIME_PENALTY_WRONG = 5; // seconds lost on a wrong click
export const HINTS_PER_ROUND = 3;
export const HINT_PULSE_MS = 1200;
export const TIME_BONUS_PER_SECOND_LEFT = 5; // round-clear bonus per second left

// A difference: panel-local coordinates (0..PANEL_W, 0..PANEL_H), a click
// radius, and a short label used by the hint pulse and the round summary.
export const ROUNDS = [
  {
    id: 'dawn-harbor',
    name: 'Dawn Harbor',
    subtitle: 'A sleepy fishing port wakes up',
    seed: 20261121,
    timeLimit: 120,
    diffs: [
      { id: 'sun', x: 505, y: 85, r: 34, label: 'the rising sun' },
      { id: 'sail', x: 150, y: 395, r: 30, label: 'the red sail' },
      { id: 'beacon', x: 78, y: 150, r: 22, label: 'the lighthouse beacon' },
      { id: 'bird', x: 300, y: 110, r: 18, label: 'a morning bird' },
      { id: 'buoy', x: 440, y: 470, r: 20, label: 'the orange buoy' },
      { id: 'roof', x: 519, y: 256, r: 28, label: 'the cottage roof' },
      { id: 'flag', x: 255, y: 304, r: 20, label: 'the pier flag' },
    ],
  },
  {
    id: 'night-market',
    name: 'Night Market',
    subtitle: 'Lanterns, steam and late-night shoppers',
    seed: 77031,
    timeLimit: 150,
    diffs: [
      { id: 'lantern', x: 120, y: 180, r: 22, label: 'the red lantern' },
      { id: 'awning', x: 310, y: 230, r: 30, label: 'the striped awning' },
      { id: 'moon', x: 520, y: 80, r: 30, label: 'the full moon' },
      { id: 'star', x: 200, y: 70, r: 14, label: 'a bright star' },
      { id: 'sign', x: 400, y: 260, r: 22, label: 'the tea-house sign' },
      { id: 'cat', x: 480, y: 470, r: 22, label: 'the market cat' },
      { id: 'jar', x: 250, y: 320, r: 18, label: 'the pickle jar' },
      { id: 'bulb', x: 365, y: 134, r: 14, label: 'a string-light bulb' },
      { id: 'hat', x: 180, y: 288, r: 24, label: "the vendor's hat" },
      { id: 'basket', x: 520, y: 422, r: 22, label: 'the fruit basket' },
    ],
  },
  {
    id: 'observatory-peak',
    name: 'Observatory Peak',
    subtitle: 'Stargazing above the clouds',
    seed: 45117,
    timeLimit: 180,
    diffs: [
      { id: 'satellite', x: 480, y: 90, r: 20, label: 'the satellite' },
      { id: 'stripe', x: 272, y: 212, r: 30, label: 'the dome stripe' },
      { id: 'scope', x: 300, y: 150, r: 24, label: 'the telescope' },
      { id: 'pine', x: 120, y: 392, r: 26, label: 'a pine tree' },
      { id: 'star', x: 200, y: 100, r: 14, label: 'a new star' },
      { id: 'window', x: 340, y: 260, r: 18, label: 'the dome window' },
      { id: 'flag', x: 430, y: 168, r: 20, label: 'the summit flag' },
      { id: 'rock', x: 520, y: 480, r: 22, label: 'a boulder' },
      { id: 'stone', x: 250, y: 500, r: 16, label: 'a stepping stone' },
      { id: 'cloud', x: 150, y: 140, r: 26, label: 'a drifting cloud' },
      { id: 'dish', x: 380, y: 108, r: 18, label: 'the radio dish' },
      { id: 'moon', x: 90, y: 80, r: 26, label: 'the moon' },
    ],
  },
];

export function starsForRound(timeLeft, timeLimit, accuracy) {
  if (accuracy >= 0.9 && timeLeft >= timeLimit * 0.3) return 3;
  if (accuracy >= 0.7) return 2;
  return 1;
}
