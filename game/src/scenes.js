// scenes.js — procedural painters for the three rounds.
// Every picture is drawn from code (no image assets). A painter receives a
// variant: 'A' paints the original, 'B' paints the altered twin. The seeded
// RNG is reset per panel, so decoration is identical on both sides and only
// the configured differences ever change.

import { ROUNDS, PANEL_W, PANEL_H } from './config.js';
import { makeRng } from './random.js';

function sky(ctx, ox, oy, top, bottom) {
  const g = ctx.createLinearGradient(0, oy, 0, oy + PANEL_H);
  g.addColorStop(0, top);
  g.addColorStop(1, bottom);
  ctx.fillStyle = g;
  ctx.fillRect(ox, oy, PANEL_W, PANEL_H);
}

function cloud(ctx, ox, oy, x, y, s, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.ellipse(ox + x, oy + y, 34 * s, 15 * s, 0, 0, Math.PI * 2);
  ctx.ellipse(ox + x - 22 * s, oy + y + 5 * s, 22 * s, 11 * s, 0, 0, Math.PI * 2);
  ctx.ellipse(ox + x + 24 * s, oy + y + 5 * s, 24 * s, 12 * s, 0, 0, Math.PI * 2);
  ctx.fill();
}

function starField(ctx, ox, oy, rng, count, maxY) {
  ctx.fillStyle = '#ffffff';
  for (let i = 0; i < count; i++) {
    const x = rng.range(15, PANEL_W - 15);
    const y = rng.range(12, maxY);
    const r = rng.range(1, 2.4);
    ctx.globalAlpha = rng.range(0.5, 1);
    ctx.beginPath();
    ctx.arc(ox + x, oy + y, r, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}

function bird(ctx, ox, oy, x, y, s) {
  ctx.strokeStyle = '#2c2c3a';
  ctx.lineWidth = 2 * s;
  ctx.beginPath();
  ctx.moveTo(ox + x - 10 * s, oy + y);
  ctx.quadraticCurveTo(ox + x - 4 * s, oy + y - 7 * s, ox + x, oy + y);
  ctx.quadraticCurveTo(ox + x + 4 * s, oy + y - 7 * s, ox + x + 10 * s, oy + y);
  ctx.stroke();
}

// ---- Round 1: Dawn Harbor -------------------------------------------------
function paintDawnHarbor(ctx, round, variant, ox, oy) {
  const b = variant === 'B';
  const rng = makeRng(round.seed);
  sky(ctx, ox, oy, '#ffd9a0', '#bfe3ee');

  // Rising sun (missing in B).
  if (!b) {
    const g = ctx.createRadialGradient(ox + 505, oy + 85, 6, ox + 505, oy + 85, 62);
    g.addColorStop(0, 'rgba(255, 214, 90, 0.95)');
    g.addColorStop(1, 'rgba(255, 214, 90, 0)');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(ox + 505, oy + 85, 62, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffcf4d';
    ctx.beginPath();
    ctx.arc(ox + 505, oy + 85, 30, 0, Math.PI * 2);
    ctx.fill();
  }

  // Drifting clouds and birds.
  cloud(ctx, ox, oy, 180, 70, 1, 'rgba(255,255,255,0.85)');
  cloud(ctx, ox, oy, 420, 150, 0.8, 'rgba(255,255,255,0.7)');
  cloud(ctx, ox, oy, 90, 200, 0.7, 'rgba(255,255,255,0.6)');
  bird(ctx, ox, oy, 240, 90, 1);
  if (!b) bird(ctx, ox, oy, 300, 110, 1); // morning bird (missing in B)
  bird(ctx, ox, oy, 360, 80, 0.9);

  // Distant hills and the sea.
  ctx.fillStyle = '#7fae8e';
  ctx.beginPath();
  ctx.moveTo(ox, oy + 300);
  ctx.quadraticCurveTo(ox + 150, oy + 255, ox + 320, oy + 298);
  ctx.quadraticCurveTo(ox + 470, oy + 268, ox + PANEL_W, oy + 296);
  ctx.lineTo(ox + PANEL_W, oy + 320);
  ctx.lineTo(ox, oy + 320);
  ctx.fill();
  const sea = ctx.createLinearGradient(0, oy + 300, 0, oy + PANEL_H);
  sea.addColorStop(0, '#4f9db8');
  sea.addColorStop(1, '#2a6d8f');
  ctx.fillStyle = sea;
  ctx.fillRect(ox, oy + 300, PANEL_W, PANEL_H - 300);
  ctx.strokeStyle = 'rgba(255,255,255,0.45)';
  ctx.lineWidth = 2;
  for (let i = 0; i < 5; i++) {
    const wy = 330 + i * 42;
    ctx.beginPath();
    for (let x = 20; x < PANEL_W - 20; x += 14) {
      ctx.moveTo(ox + x, oy + wy + Math.sin(x * 0.09 + i) * 3);
      ctx.lineTo(ox + x + 8, oy + wy + Math.sin(x * 0.09 + i) * 3);
    }
    ctx.stroke();
  }

  // Lighthouse on the left cliff.
  ctx.fillStyle = '#5d6b73';
  ctx.fillRect(ox + 40, oy + 250, 76, 52);
  ctx.fillStyle = '#f4f1e6';
  ctx.fillRect(ox + 58, oy + 168, 40, 84);
  ctx.fillStyle = '#d94f3d';
  ctx.fillRect(ox + 58, oy + 196, 40, 14);
  ctx.fillRect(ox + 58, oy + 228, 40, 14);
  ctx.fillStyle = '#33414d';
  ctx.fillRect(ox + 54, oy + 148, 48, 22);
  // Beacon: warm glow in A, dark glass in B.
  ctx.fillStyle = b ? '#22303a' : '#ffe27a';
  ctx.beginPath();
  ctx.arc(ox + 78, oy + 150, 9, 0, Math.PI * 2);
  ctx.fill();
  if (!b) {
    ctx.strokeStyle = 'rgba(255,226,122,0.8)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(ox + 78, oy + 150, 17, 0, Math.PI * 2);
    ctx.stroke();
  }

  // Cottages along the shore; one roof changes colour in B.
  ctx.fillStyle = '#e8dcc3';
  ctx.fillRect(ox + 480, oy + 268, 78, 40);
  ctx.fillStyle = b ? '#2f8f83' : '#c96f3f';
  ctx.beginPath();
  ctx.moveTo(ox + 472, oy + 270);
  ctx.lineTo(ox + 519, oy + 238);
  ctx.lineTo(ox + 566, oy + 270);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#3a2f28';
  ctx.fillRect(ox + 510, oy + 284, 16, 24);
  ctx.fillStyle = '#e8dcc3';
  ctx.fillRect(ox + 380, oy + 278, 56, 30);
  ctx.fillStyle = '#7a5a8c';
  ctx.beginPath();
  ctx.moveTo(ox + 374, oy + 280);
  ctx.lineTo(ox + 408, oy + 256);
  ctx.lineTo(ox + 442, oy + 280);
  ctx.closePath();
  ctx.fill();

  // Wooden pier with a flag that flips direction in B.
  ctx.fillStyle = '#8a6a48';
  ctx.fillRect(ox + 210, oy + 330, 130, 12);
  ctx.fillStyle = '#6f5236';
  for (let x = 214; x < 340; x += 16) ctx.fillRect(ox + x, oy + 330, 3, 12);
  ctx.fillRect(ox + 222, oy + 342, 8, 26);
  ctx.fillRect(ox + 318, oy + 342, 8, 26);
  ctx.strokeStyle = '#5d4630';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(ox + 255, oy + 330);
  ctx.lineTo(ox + 255, oy + 296);
  ctx.stroke();
  ctx.fillStyle = '#e2574c';
  ctx.beginPath();
  if (!b) {
    ctx.moveTo(ox + 255, oy + 296);
    ctx.lineTo(ox + 281, oy + 303);
    ctx.lineTo(ox + 255, oy + 310);
  } else {
    ctx.moveTo(ox + 255, oy + 296);
    ctx.lineTo(ox + 229, oy + 303);
    ctx.lineTo(ox + 255, oy + 310);
  }
  ctx.closePath();
  ctx.fill();

  // Sailboat; its sail is red in A and blue in B.
  ctx.fillStyle = '#7a3b2e';
  ctx.beginPath();
  ctx.moveTo(ox + 110, oy + 420);
  ctx.lineTo(ox + 190, oy + 420);
  ctx.lineTo(ox + 178, oy + 440);
  ctx.lineTo(ox + 122, oy + 440);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#5d4630';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(ox + 150, oy + 420);
  ctx.lineTo(ox + 150, oy + 352);
  ctx.stroke();
  ctx.fillStyle = b ? '#2f6fb2' : '#d94f3d';
  ctx.beginPath();
  ctx.moveTo(ox + 150, oy + 356);
  ctx.lineTo(ox + 150, oy + 414);
  ctx.lineTo(ox + 186, oy + 414);
  ctx.closePath();
  ctx.fill();
  // A second, smaller boat far off.
  ctx.fillStyle = '#4a3226';
  ctx.beginPath();
  ctx.moveTo(ox + 360, oy + 448);
  ctx.lineTo(ox + 410, oy + 448);
  ctx.lineTo(ox + 400, oy + 462);
  ctx.lineTo(ox + 370, oy + 462);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#f2ead8';
  ctx.beginPath();
  ctx.moveTo(ox + 385, oy + 446);
  ctx.lineTo(ox + 385, oy + 412);
  ctx.lineTo(ox + 406, oy + 446);
  ctx.closePath();
  ctx.fill();

  // Orange buoy that only appears in B.
  if (b) {
    ctx.fillStyle = '#ff7a1a';
    ctx.beginPath();
    ctx.arc(ox + 440, oy + 470, 13, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.fillRect(ox + 427, oy + 466, 26, 5);
    ctx.fillStyle = '#333';
    ctx.fillRect(ox + 437, oy + 452, 6, 8);
  }
  void rng;
}

// ---- Round 2: Night Market --------------------------------------------------
function paintNightMarket(ctx, round, variant, ox, oy) {
  const b = variant === 'B';
  const rng = makeRng(round.seed);
  sky(ctx, ox, oy, '#101736', '#2c2350');

  // Moon: full with a crater in A, crescent in B.
  ctx.fillStyle = '#f5eeda';
  ctx.beginPath();
  ctx.arc(ox + 520, oy + 80, 28, 0, Math.PI * 2);
  ctx.fill();
  if (b) {
    ctx.fillStyle = '#2c2350';
    ctx.beginPath();
    ctx.arc(ox + 532, oy + 74, 24, 0, Math.PI * 2);
    ctx.fill();
  } else {
    ctx.fillStyle = '#d8cdb2';
    ctx.beginPath();
    ctx.arc(ox + 512, oy + 72, 6, 0, Math.PI * 2);
    ctx.arc(ox + 528, oy + 90, 4, 0, Math.PI * 2);
    ctx.fill();
  }

  starField(ctx, ox, oy, rng, 46, 150);
  if (!b) {
    // One bright star, missing in B.
    ctx.fillStyle = '#fff8c0';
    ctx.beginPath();
    ctx.arc(ox + 200, oy + 70, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = 'rgba(255,248,192,0.7)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(ox + 200, oy + 58);
    ctx.lineTo(ox + 200, oy + 82);
    ctx.moveTo(ox + 188, oy + 70);
    ctx.lineTo(ox + 212, oy + 70);
    ctx.stroke();
  }

  // String lights across the top; one bulb is dark in B.
  ctx.strokeStyle = '#0c0c18';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(ox + 20, oy + 104);
  ctx.quadraticCurveTo(ox + 300, oy + 150, ox + 580, oy + 104);
  ctx.stroke();
  for (let i = 0; i < 9; i++) {
    const t = i / 8;
    const x = 40 + t * 520;
    const y = 106 + Math.sin(t * Math.PI) * 22;
    const lit = !(b && i === 5);
    ctx.fillStyle = lit ? '#ffd76a' : '#3a3a4d';
    ctx.beginPath();
    ctx.arc(ox + x, oy + y + 8, 6, 0, Math.PI * 2);
    ctx.fill();
    if (lit) {
      ctx.strokeStyle = 'rgba(255,215,106,0.5)';
      ctx.beginPath();
      ctx.arc(ox + x, oy + y + 8, 11, 0, Math.PI * 2);
      ctx.stroke();
    }
  }

  // Ground and stall row.
  ctx.fillStyle = '#241d33';
  ctx.fillRect(ox, oy + 380, PANEL_W, PANEL_H - 380);
  ctx.fillStyle = '#3a2f52';
  ctx.fillRect(ox, oy + 380, PANEL_W, 10);

  // Stall 1 (left): lantern above it, vendor with a hat.
  ctx.fillStyle = '#6b4a2f';
  ctx.fillRect(ox + 90, oy + 250, 130, 130);
  ctx.fillStyle = '#8a5f3c';
  ctx.fillRect(ox + 82, oy + 300, 146, 14);
  ctx.fillStyle = '#c94f43';
  ctx.beginPath();
  ctx.moveTo(ox + 80, oy + 252);
  ctx.lineTo(ox + 230, oy + 252);
  ctx.lineTo(ox + 214, oy + 214);
  ctx.lineTo(ox + 96, oy + 214);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#f2e3c2';
  ctx.fillRect(ox + 96, oy + 214, 10, 38);
  ctx.fillRect(ox + 204, oy + 214, 10, 38);
  // Red paper lantern (missing in B).
  if (!b) {
    ctx.fillStyle = '#e23b2e';
    ctx.beginPath();
    ctx.ellipse(ox + 120, oy + 180, 18, 22, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffd76a';
    ctx.fillRect(ox + 114, oy + 174, 12, 12);
    ctx.strokeStyle = '#7a1d14';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(ox + 120, oy + 158);
    ctx.lineTo(ox + 120, oy + 148);
    ctx.stroke();
  }
  // Vendor: head, body, hat (straw in A, red in B).
  ctx.fillStyle = '#f0c8a0';
  ctx.beginPath();
  ctx.arc(ox + 180, oy + 292, 16, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#4a6b8a';
  ctx.beginPath();
  ctx.moveTo(ox + 156, oy + 330);
  ctx.quadraticCurveTo(ox + 180, oy + 306, ox + 204, oy + 330);
  ctx.lineTo(ox + 204, oy + 380);
  ctx.lineTo(ox + 156, oy + 380);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = b ? '#c0392b' : '#e8c96a';
  ctx.beginPath();
  ctx.ellipse(ox + 180, oy + 282, 26, 8, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(ox + 180, oy + 280, 13, Math.PI, 0);
  ctx.fill();

  // Stall 2 (middle): striped awning in A, solid green in B; a pickle jar.
  ctx.fillStyle = '#5d3a26';
  ctx.fillRect(ox + 250, oy + 250, 130, 130);
  if (!b) {
    for (let i = 0; i < 6; i++) {
      ctx.fillStyle = i % 2 === 0 ? '#c94f43' : '#f2e3c2';
      ctx.fillRect(ox + 244 + i * 24, oy + 210, 24, 42);
    }
  } else {
    ctx.fillStyle = '#2f8f5b';
    ctx.fillRect(ox + 244, oy + 210, 144, 42);
  }
  ctx.fillStyle = '#8a5f3c';
  ctx.fillRect(ox + 242, oy + 300, 146, 14);
  // Pickle jar on the counter (missing in B).
  if (!b) {
    ctx.fillStyle = '#bfe3c0';
    ctx.beginPath();
    ctx.ellipse(ox + 250, oy + 322, 12, 15, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#7a5a3a';
    ctx.fillRect(ox + 240, oy + 304, 20, 6);
    ctx.fillStyle = '#4f7a3a';
    ctx.beginPath();
    ctx.arc(ox + 250, oy + 322, 5, 0, Math.PI * 2);
    ctx.fill();
  }
  // Fruit pile on stall 2.
  ctx.fillStyle = '#e2574c';
  for (const [fx, fy] of [[300, 292], [318, 292], [309, 280]]) {
    ctx.beginPath();
    ctx.arc(ox + fx, oy + fy, 8, 0, Math.PI * 2);
    ctx.fill();
  }

  // Stall 3 (right): tea-house sign that reads TEA in A, SOUP in B.
  ctx.fillStyle = '#4a3226';
  ctx.fillRect(ox + 400, oy + 250, 140, 130);
  ctx.fillStyle = '#7a3b2e';
  ctx.beginPath();
  ctx.moveTo(ox + 394, oy + 252);
  ctx.lineTo(ox + 546, oy + 252);
  ctx.lineTo(ox + 532, oy + 214);
  ctx.lineTo(ox + 408, oy + 214);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#f2e3c2';
  ctx.fillRect(ox + 400, oy + 300, 140, 14);
  ctx.fillStyle = '#2c1c12';
  ctx.fillRect(ox + 368, oy + 240, 64, 40);
  ctx.strokeStyle = '#e8c96a';
  ctx.lineWidth = 2;
  ctx.strokeRect(ox + 368, oy + 240, 64, 40);
  ctx.fillStyle = '#ffe9a8';
  ctx.font = 'bold 20px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(b ? 'SOUP' : 'TEA', ox + 400, oy + 261);
  // Tea cups on the counter.
  ctx.fillStyle = '#e8e0cc';
  ctx.fillRect(ox + 470, oy + 288, 18, 12);
  ctx.fillRect(ox + 500, oy + 288, 18, 12);

  // Fruit basket: at the stall in A, shifted left in B.
  const bx = b ? 462 : 520;
  ctx.fillStyle = '#a8763e';
  ctx.beginPath();
  ctx.moveTo(ox + bx - 20, oy + 420);
  ctx.lineTo(ox + bx + 20, oy + 420);
  ctx.lineTo(ox + bx + 14, oy + 444);
  ctx.lineTo(ox + bx - 14, oy + 444);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#7ac74f';
  ctx.beginPath();
  ctx.arc(ox + bx - 8, oy + 414, 7, 0, Math.PI * 2);
  ctx.arc(ox + bx + 8, oy + 414, 7, 0, Math.PI * 2);
  ctx.fill();

  // The market cat, only in B.
  if (b) {
    ctx.fillStyle = '#1c1c26';
    ctx.beginPath();
    ctx.ellipse(ox + 480, oy + 472, 20, 13, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(ox + 496, oy + 456, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(ox + 490, oy + 448);
    ctx.lineTo(ox + 493, oy + 438);
    ctx.lineTo(ox + 497, oy + 448);
    ctx.moveTo(ox + 500, oy + 448);
    ctx.lineTo(ox + 503, oy + 438);
    ctx.lineTo(ox + 506, oy + 448);
    ctx.fill();
    ctx.fillStyle = '#ffd76a';
    ctx.beginPath();
    ctx.arc(ox + 499, oy + 455, 1.8, 0, Math.PI * 2);
    ctx.fill();
  }
  void rng;
}

// ---- Round 3: Observatory Peak ----------------------------------------------
function paintObservatory(ctx, round, variant, ox, oy) {
  const b = variant === 'B';
  const rng = makeRng(round.seed);
  sky(ctx, ox, oy, '#0a1030', '#3a2a5e');

  // Moon: crescent in A, full in B.
  ctx.fillStyle = '#f5eeda';
  ctx.beginPath();
  ctx.arc(ox + 90, oy + 80, 24, 0, Math.PI * 2);
  ctx.fill();
  if (!b) {
    ctx.fillStyle = '#3a2a5e';
    ctx.beginPath();
    ctx.arc(ox + 100, oy + 74, 20, 0, Math.PI * 2);
    ctx.fill();
  }

  starField(ctx, ox, oy, rng, 60, 200);
  // A new star that only appears in B.
  if (b) {
    ctx.fillStyle = '#fff8c0';
    ctx.beginPath();
    ctx.arc(ox + 200, oy + 100, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = 'rgba(255,248,192,0.7)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(ox + 200, oy + 88);
    ctx.lineTo(ox + 200, oy + 112);
    ctx.moveTo(ox + 188, oy + 100);
    ctx.lineTo(ox + 212, oy + 100);
    ctx.stroke();
  }

  // Satellite crossing the sky (missing in B).
  if (!b) {
    ctx.strokeStyle = '#cfd6e4';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(ox + 462, oy + 82);
    ctx.lineTo(ox + 498, oy + 98);
    ctx.stroke();
    ctx.fillStyle = '#9fb2cc';
    ctx.fillRect(ox + 470, oy + 82, 16, 10);
    ctx.fillStyle = '#5f7fb2';
    ctx.fillRect(ox + 458, oy + 86, 10, 4);
    ctx.fillRect(ox + 492, oy + 92, 10, 4);
    ctx.fillStyle = '#ff5a4d';
    ctx.beginPath();
    ctx.arc(ox + 500, oy + 100, 2.5, 0, Math.PI * 2);
    ctx.fill();
  }

  // Drifting cloud (missing in B).
  if (!b) cloud(ctx, ox, oy, 150, 140, 0.9, 'rgba(220,225,245,0.5)');

  // Mountain ridges.
  ctx.fillStyle = '#2c2350';
  ctx.beginPath();
  ctx.moveTo(ox, oy + 340);
  ctx.lineTo(ox + 120, oy + 230);
  ctx.lineTo(ox + 240, oy + 340);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#f2f4fa';
  ctx.beginPath();
  ctx.moveTo(ox + 102, oy + 248);
  ctx.lineTo(ox + 120, oy + 230);
  ctx.lineTo(ox + 138, oy + 248);
  ctx.lineTo(ox + 120, oy + 258);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#241c44';
  ctx.beginPath();
  ctx.moveTo(ox + 360, oy + 340);
  ctx.lineTo(ox + 500, oy + 250);
  ctx.lineTo(ox + PANEL_W, oy + 340);
  ctx.closePath();
  ctx.fill();

  // Ground and the winding path.
  ctx.fillStyle = '#1d2b3a';
  ctx.fillRect(ox, oy + 340, PANEL_W, PANEL_H - 340);
  ctx.fillStyle = '#c9b18a';
  ctx.beginPath();
  ctx.moveTo(ox + 250, oy + 560);
  ctx.lineTo(ox + 290, oy + 340);
  ctx.lineTo(ox + 330, oy + 340);
  ctx.lineTo(ox + 360, oy + 560);
  ctx.closePath();
  ctx.fill();
  // Stepping stones (the one at 250,500 is missing in B).
  ctx.fillStyle = '#8a7a5c';
  for (const [sx, sy] of [[272, 520], [300, 470], [318, 420]]) {
    ctx.beginPath();
    ctx.ellipse(ox + sx, oy + sy, 16, 7, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  if (!b) {
    ctx.beginPath();
    ctx.ellipse(ox + 250, oy + 500, 16, 7, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  // Pine trees; one is missing in B.
  function pine(px, py, s) {
    ctx.fillStyle = '#5d3a26';
    ctx.fillRect(ox + px - 4 * s, oy + py, 8 * s, 18 * s);
    ctx.fillStyle = '#1f5c33';
    for (let i = 0; i < 3; i++) {
      const w = (34 - i * 9) * s;
      const y = py - i * 16 * s;
      ctx.beginPath();
      ctx.moveTo(ox + px - w / 2, oy + y);
      ctx.lineTo(ox + px, oy + y - 22 * s);
      ctx.lineTo(ox + px + w / 2, oy + y);
      ctx.closePath();
      ctx.fill();
    }
  }
  pine(60, 420, 1);
  if (!b) pine(120, 420, 1.1);
  pine(540, 430, 0.9);
  pine(470, 470, 0.8);

  // Observatory building and dome.
  ctx.fillStyle = '#d8d2c2';
  ctx.fillRect(ox + 240, oy + 260, 130, 80);
  ctx.fillStyle = '#b9b2a0';
  ctx.fillRect(ox + 240, oy + 260, 130, 8);
  // Dome window: dark in A, warmly lit in B.
  ctx.fillStyle = b ? '#ffd76a' : '#2c3550';
  ctx.beginPath();
  ctx.arc(ox + 340, oy + 260, 12, 0, Math.PI * 2);
  ctx.fill();
  if (b) {
    ctx.strokeStyle = 'rgba(255,215,106,0.6)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(ox + 340, oy + 260, 18, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.fillStyle = '#e8e4d8';
  ctx.beginPath();
  ctx.arc(ox + 305, oy + 258, 58, Math.PI, 0);
  ctx.fill();
  // Dome stripe: red in A, blue in B.
  ctx.fillStyle = b ? '#2f6fb2' : '#c94f43';
  ctx.beginPath();
  ctx.arc(ox + 305, oy + 258, 58, Math.PI * 1.15, Math.PI * 1.45);
  ctx.lineTo(ox + 305, oy + 258);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#8a8474';
  ctx.fillRect(ox + 296, oy + 196, 18, 10);

  // Telescope on the dome: points up-right in A, up-left in B.
  ctx.save();
  ctx.translate(ox + 300, oy + 150);
  ctx.rotate(b ? -0.6 : 0.6);
  ctx.fillStyle = '#3a4a5e';
  ctx.fillRect(-6, -34, 12, 52);
  ctx.fillStyle = '#6b7f99';
  ctx.fillRect(-9, -40, 18, 10);
  ctx.restore();
  ctx.fillStyle = '#3a4a5e';
  ctx.beginPath();
  ctx.arc(ox + 300, oy + 150, 8, 0, Math.PI * 2);
  ctx.fill();

  // Radio dish: points left in A, right in B.
  ctx.strokeStyle = '#5d6b7a';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(ox + 380, oy + 150);
  ctx.lineTo(ox + 380, oy + 104);
  ctx.stroke();
  ctx.fillStyle = '#9fb2cc';
  ctx.beginPath();
  if (!b) {
    ctx.moveTo(ox + 380, oy + 104);
    ctx.arc(ox + 380, oy + 104, 16, Math.PI * 0.5, Math.PI * 1.5);
  } else {
    ctx.moveTo(ox + 380, oy + 104);
    ctx.arc(ox + 380, oy + 104, 16, -Math.PI * 0.5, Math.PI * 0.5);
  }
  ctx.closePath();
  ctx.fill();

  // Summit flag (missing in B).
  if (!b) {
    ctx.strokeStyle = '#5d4630';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(ox + 420, oy + 210);
    ctx.lineTo(ox + 420, oy + 160);
    ctx.stroke();
    ctx.fillStyle = '#e2574c';
    ctx.beginPath();
    ctx.moveTo(ox + 420, oy + 160);
    ctx.lineTo(ox + 444, oy + 167);
    ctx.lineTo(ox + 420, oy + 174);
    ctx.closePath();
    ctx.fill();
  }

  // Boulder that only appears in B.
  if (b) {
    ctx.fillStyle = '#6b7280';
    ctx.beginPath();
    ctx.ellipse(ox + 520, oy + 480, 22, 15, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#8b929e';
    ctx.beginPath();
    ctx.ellipse(ox + 512, oy + 474, 10, 6, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  void rng;
}

const PAINTERS = [paintDawnHarbor, paintNightMarket, paintObservatory];

// Paint one panel of a round. variant 'A' is the original, 'B' the twin.
export function paintScene(ctx, roundIndex, variant, ox, oy) {
  const round = ROUNDS[roundIndex];
  PAINTERS[roundIndex](ctx, round, variant, ox, oy);
}

export function roundById(id) {
  return ROUNDS.findIndex((r) => r.id === id);
}
