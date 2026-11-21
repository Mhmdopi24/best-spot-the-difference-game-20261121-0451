// render.js — draws a frame: both panels, found markers, hint pulse,
// wrong-click crosses, shake, and the title / round-end / game-over / final
// overlays. The HUD bar itself is DOM (see index.html); this file owns the
// canvas only.

import {
  PANEL_W, PANEL_H, PANEL_Y, PANEL_LEFT_X, PANEL_RIGHT_X,
  CANVAS_W, CANVAS_H,
} from './config.js';
import { paintScene } from './scenes.js';

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function panelFrame(ctx, x, label) {
  ctx.strokeStyle = '#2c2c3a';
  ctx.lineWidth = 3;
  ctx.strokeRect(x, PANEL_Y, PANEL_W, PANEL_H);
  ctx.fillStyle = 'rgba(20, 20, 32, 0.85)';
  ctx.fillRect(x + 8, PANEL_Y + 8, 74, 26);
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 15px sans-serif';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText(label, x + 18, PANEL_Y + 22);
}

function foundRing(ctx, x, y, r, pulse) {
  const rr = r + (pulse ? Math.sin(Date.now() / 130) * 3 : 0);
  ctx.strokeStyle = '#2fd95f';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(x, y, rr, 0, Math.PI * 2);
  ctx.stroke();
  ctx.strokeStyle = 'rgba(255,255,255,0.9)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(x, y, rr + 4, 0, Math.PI * 2);
  ctx.stroke();
}

function drawStars(ctx, cx, y, count) {
  for (let i = 0; i < 3; i++) {
    const x = cx - 64 + i * 64;
    ctx.fillStyle = i < count ? '#ffd94d' : '#4a4a5e';
    ctx.beginPath();
    for (let k = 0; k < 10; k++) {
      const ang = -Math.PI / 2 + (k * Math.PI) / 5;
      const rad = k % 2 === 0 ? 26 : 11;
      const px = x + Math.cos(ang) * rad;
      const py = y + Math.sin(ang) * rad;
      if (k === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fill();
  }
}

function overlay(ctx, title, lines, hint) {
  ctx.fillStyle = 'rgba(12, 12, 24, 0.72)';
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
  ctx.fillStyle = '#f5f1e6';
  ctx.font = 'bold 44px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(title, CANVAS_W / 2, 190);
  ctx.font = '20px sans-serif';
  ctx.fillStyle = '#d8d4c4';
  lines.forEach((line, i) => {
    ctx.fillText(line, CANVAS_W / 2, 250 + i * 32);
  });
  if (hint) {
    ctx.font = 'bold 18px sans-serif';
    ctx.fillStyle = '#ffd94d';
    ctx.fillText(hint, CANVAS_W / 2, 250 + lines.length * 32 + 26);
  }
}

// state: { phase, roundIndex, found:Set, hint:{diff,until}|null,
//           wrong:[{x,y,until}], shakeUntil, score, roundScore, ... }
export function drawGame(ctx, state) {
  ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);
  ctx.fillStyle = '#17141f';
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

  const now = Date.now();
  let dx = 0;
  let dy = 0;
  if (now < state.shakeUntil) {
    dx = (Math.random() - 0.5) * 10;
    dy = (Math.random() - 0.5) * 10;
  }
  ctx.save();
  ctx.translate(dx, dy);

  const round = state.round;
  paintScene(ctx, state.roundIndex, 'A', PANEL_LEFT_X, PANEL_Y);
  paintScene(ctx, state.roundIndex, 'B', PANEL_RIGHT_X, PANEL_Y);

  // Green rings on every difference already found, on both panels.
  for (const idx of state.found) {
    const d = round.diffs[idx];
    foundRing(ctx, PANEL_LEFT_X + d.x, PANEL_Y + d.y, d.r, false);
    foundRing(ctx, PANEL_RIGHT_X + d.x, PANEL_Y + d.y, d.r, false);
  }

  // Hint pulse on one unfound difference, on both panels.
  if (state.hint && now < state.hint.until) {
    const d = round.diffs[state.hint.diff];
    foundRing(ctx, PANEL_LEFT_X + d.x, PANEL_Y + d.y, d.r + 6, true);
    foundRing(ctx, PANEL_RIGHT_X + d.x, PANEL_Y + d.y, d.r + 6, true);
  }

  // Red crosses where the player just clicked wrong.
  for (const w of state.wrong) {
    if (now > w.until) continue;
    ctx.strokeStyle = '#ff4d4d';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(w.x - 12, w.y - 12);
    ctx.lineTo(w.x + 12, w.y + 12);
    ctx.moveTo(w.x + 12, w.y - 12);
    ctx.lineTo(w.x - 12, w.y + 12);
    ctx.stroke();
  }

  panelFrame(ctx, PANEL_LEFT_X, 'ORIGINAL');
  panelFrame(ctx, PANEL_RIGHT_X, 'TWIN');
  ctx.restore();

  // Overlays sit above the panels (no shake).
  if (state.phase === 'title') {
    overlay(
      ctx,
      'TWIN HARBOR',
      [
        'Spot the difference between the two harbor scenes.',
        'Click a difference on either picture to mark it.',
        'Wrong clicks cost 5 seconds. Hints cost nothing but pride.',
        'Three rounds: Dawn Harbor, Night Market, Observatory Peak.',
      ],
      'Click anywhere or press N to set sail',
    );
  } else if (state.phase === 'roundEnd') {
    overlay(
      ctx,
      `${state.round.name} — Cleared!`,
      [
        `Found ${state.round.diffs.length} / ${state.round.diffs.length} differences`,
        `Round score ${state.roundScore}  •  Total score ${state.score}`,
        `Accuracy ${Math.round(state.accuracy * 100)}%  •  Time left ${Math.ceil(state.timeLeft)}s`,
      ],
      state.roundIndex < 2 ? 'Press N for the next round' : 'Press N for your final tally',
    );
    drawStars(ctx, CANVAS_W / 2, 120, state.lastStars);
  } else if (state.phase === 'gameOver') {
    overlay(
      ctx,
      'Time Up!',
      [
        `${state.round.name}: found ${state.found.size} of ${state.round.diffs.length} differences`,
        `Score so far: ${state.score}`,
      ],
      'Press R to try this round again',
    );
  } else if (state.phase === 'final') {
    overlay(
      ctx,
      'All Rounds Cleared!',
      [
        `Final score: ${state.score}`,
        `Total accuracy: ${Math.round(state.totalAccuracy * 100)}%`,
        `Differences found: ${state.totalFound} of ${state.totalDiffs}`,
        'Thanks for playing Twin Harbor.',
      ],
      'Press R to play again',
    );
    drawStars(ctx, CANVAS_W / 2, 120, state.totalStars);
  }
}
