// main.js — Twin Harbor state machine: rounds, timer, score, hints and
// the deterministic demo mode (?shot=) used for reproducible screenshots.
// The timer only runs while phase is 'play' and the shot mode is off.

import {
  ROUNDS, POINTS_PER_FIND, TIME_BONUS_PER_FIND, TIME_PENALTY_WRONG,
  HINTS_PER_ROUND, HINT_PULSE_MS, TIME_BONUS_PER_SECOND_LEFT,
  CANVAS_W, CANVAS_H, starsForRound,
} from './config.js';
import { drawGame } from './render.js';
import { attachInput } from './input.js';
import { SoundFX } from './audio.js';

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const sfx = new SoundFX();

const el = {
  round: document.getElementById('hud-round'),
  found: document.getElementById('hud-found'),
  timerText: document.getElementById('hud-timer-text'),
  timerBar: document.getElementById('hud-timer-bar'),
  score: document.getElementById('hud-score'),
  hints: document.getElementById('hud-hints'),
  hintBtn: document.getElementById('btn-hint'),
  muteBtn: document.getElementById('btn-mute'),
};

const state = {
  phase: 'title', // title | play | roundEnd | gameOver | final
  roundIndex: 0,
  round: ROUNDS[0],
  found: new Set(),
  clicks: 0,
  correctClicks: 0,
  hintsLeft: HINTS_PER_ROUND,
  hint: null,
  wrong: [],
  shakeUntil: 0,
  score: 0,
  roundScore: 0,
  timeLeft: ROUNDS[0].timeLimit,
  lastStars: 0,
  accuracy: 1,
  totalStars: 0,
  totalAccuracy: 1,
  totalClicks: 0,
  totalCorrect: 0,
  totalFound: 0,
  totalDiffs: ROUNDS.reduce((n, r) => n + r.diffs.length, 0),
  shotMode: false,
};

function fmtTime(seconds) {
  const s = Math.max(0, Math.ceil(seconds));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}

function updateHud() {
  const round = state.round;
  el.round.textContent = `Round ${state.roundIndex + 1}/3 — ${round.name}`;
  el.found.textContent = `Found ${state.found.size} / ${round.diffs.length}`;
  el.timerText.textContent = fmtTime(state.timeLeft);
  const pct = Math.max(0, Math.min(100, (state.timeLeft / round.timeLimit) * 100));
  el.timerBar.style.width = `${pct}%`;
  el.timerBar.style.background = pct < 20 ? '#ff4d4d' : pct < 45 ? '#ffb84d' : '#2fd95f';
  el.score.textContent = `Score ${state.score}`;
  el.hints.textContent = `Hints ${state.hintsLeft}`;
  el.hintBtn.disabled = state.phase !== 'play' || state.hintsLeft <= 0;
  el.muteBtn.textContent = sfx.muted ? 'Sound: Off (M)' : 'Sound: On (M)';
}

function startRound(index) {
  state.roundIndex = index;
  state.round = ROUNDS[index];
  state.phase = 'play';
  state.found = new Set();
  state.clicks = 0;
  state.correctClicks = 0;
  state.hintsLeft = HINTS_PER_ROUND;
  state.hint = null;
  state.wrong = [];
  state.roundScore = 0;
  state.timeLeft = state.round.timeLimit;
  updateHud();
}

function endRound() {
  const timeBonus = Math.ceil(state.timeLeft) * TIME_BONUS_PER_SECOND_LEFT;
  state.roundScore = state.found.size * POINTS_PER_FIND + timeBonus;
  state.score += timeBonus;
  state.accuracy = state.clicks === 0 ? 1 : state.correctClicks / state.clicks;
  state.lastStars = starsForRound(state.timeLeft, state.round.timeLimit, state.accuracy);
  state.totalStars += state.lastStars;
  state.totalClicks += state.clicks;
  state.totalCorrect += state.correctClicks;
  state.totalFound += state.found.size;
  state.phase = 'roundEnd';
  sfx.fanfare();
  updateHud();
}

function endGame() {
  state.totalAccuracy = state.totalClicks === 0 ? 1 : state.totalCorrect / state.totalClicks;
  state.phase = 'final';
  sfx.fanfare();
  updateHud();
}

function onPanelClick(hit) {
  if (state.phase === 'title') {
    sfx.ensure();
    sfx.click();
    startRound(0);
    return;
  }
  if (state.phase !== 'play') return;
  state.clicks += 1;
  const round = state.round;
  let hitIdx = -1;
  round.diffs.forEach((d, i) => {
    if (state.found.has(i)) return;
    const dx = hit.x - d.x;
    const dy = hit.y - d.y;
    if (dx * dx + dy * dy <= d.r * d.r) hitIdx = i;
  });
  if (hitIdx >= 0) {
    state.found.add(hitIdx);
    state.correctClicks += 1;
    state.score += POINTS_PER_FIND;
    state.timeLeft = Math.min(round.timeLimit, state.timeLeft + TIME_BONUS_PER_FIND);
    sfx.chime();
    if (state.found.size === round.diffs.length) endRound();
  } else {
    state.timeLeft = Math.max(0, state.timeLeft - TIME_PENALTY_WRONG);
    state.wrong.push({ x: hit.x + (hit.panel === 'B' ? 660 : 20), y: hit.y + 20, until: Date.now() + 700 });
    state.shakeUntil = Date.now() + 220;
    sfx.buzz();
    if (state.timeLeft <= 0) {
      state.phase = 'gameOver';
      updateHud();
    }
  }
  updateHud();
}

function useHint() {
  if (state.phase !== 'play' || state.hintsLeft <= 0) return;
  const remaining = state.round.diffs.map((_, i) => i).filter((i) => !state.found.has(i));
  if (remaining.length === 0) return;
  const pick = remaining[Math.floor(Math.random() * remaining.length)];
  state.hint = { diff: pick, until: Date.now() + HINT_PULSE_MS };
  state.hintsLeft -= 1;
  sfx.click();
  updateHud();
}

function onNext() {
  if (state.phase === 'title') {
    startRound(0);
  } else if (state.phase === 'roundEnd') {
    if (state.roundIndex < ROUNDS.length - 1) startRound(state.roundIndex + 1);
    else endGame();
  } else if (state.phase === 'final') {
    state.score = 0;
    state.totalFound = 0;
    state.totalStars = 0;
    state.totalClicks = 0;
    state.totalCorrect = 0;
    startRound(0);
  }
}

function onRetry() {
  if (state.phase === 'gameOver') startRound(state.roundIndex);
  else if (state.phase === 'final') {
    state.score = 0;
    state.totalFound = 0;
    state.totalStars = 0;
    state.totalClicks = 0;
    state.totalCorrect = 0;
    startRound(0);
  }
}

function onMute() {
  sfx.ensure();
  sfx.toggleMute();
  updateHud();
}

// Deterministic demo mode for screenshots: ?shot=start|play|end&round=N
// &found=a,b,c — the timer is paused and the state is set exactly.
function applyShotMode() {
  const params = new URLSearchParams(window.location.search);
  const shot = params.get('shot');
  if (!shot) return;
  state.shotMode = true;
  const roundNum = Math.min(3, Math.max(1, parseInt(params.get('round') || '1', 10)));
  const roundIndex = roundNum - 1;
  const foundList = (params.get('found') || '')
    .split(',')
    .map((s) => parseInt(s, 10))
    .filter((n) => Number.isFinite(n));
  startRound(roundIndex);
  if (shot === 'start') {
    state.found = new Set();
  } else if (shot === 'play') {
    state.found = new Set(foundList);
    state.clicks = state.found.size;
    state.correctClicks = state.found.size;
    state.timeLeft = state.round.timeLimit - 30;
  } else if (shot === 'end') {
    state.found = new Set(state.round.diffs.map((_, i) => i));
    state.clicks = state.found.size;
    state.correctClicks = state.found.size;
    state.timeLeft = 47;
    state.accuracy = 1;
    state.roundScore = state.found.size * POINTS_PER_FIND + 47 * TIME_BONUS_PER_SECOND_LEFT;
    state.score = state.roundScore;
    state.lastStars = 3;
    if (roundNum === 3) {
      state.score = 2840;
      state.totalFound = state.totalDiffs;
      state.totalAccuracy = 0.94;
      state.totalStars = 3;
      state.phase = 'final';
    } else {
      state.phase = 'roundEnd';
    }
  }
  updateHud();
}

attachInput(canvas, {
  onPanelClick,
  onHint: useHint,
  onNext,
  onRetry,
  onMute,
});
el.hintBtn.addEventListener('click', useHint);
el.muteBtn.addEventListener('click', onMute);

applyShotMode();
updateHud();

let lastTick = performance.now();
function frame(now) {
  const dt = Math.min(0.25, (now - lastTick) / 1000);
  lastTick = now;
  if (state.phase === 'play' && !state.shotMode) {
    state.timeLeft -= dt;
    if (state.timeLeft <= 0) {
      state.timeLeft = 0;
      state.phase = 'gameOver';
      updateHud();
    }
  }
  // Expire stale wrong-click crosses.
  if (state.wrong.length > 0) {
    state.wrong = state.wrong.filter((w) => Date.now() < w.until);
  }
  updateHud();
  drawGame(ctx, state);
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);

// Exposed for local play-testing (Playwright): read-only-ish live state.
window.__game = {
  state,
  startRound,
  useHint,
  onNext,
  onRetry,
};
