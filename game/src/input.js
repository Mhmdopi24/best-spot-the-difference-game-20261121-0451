// input.js — pointer and keyboard input for Twin Harbor.
// Clicks are translated to panel-local coordinates; the game logic decides
// whether a click lands on a difference. Keys: H hint, N next, R retry, M mute.

import { PANEL_W, PANEL_H, PANEL_Y, PANEL_LEFT_X, PANEL_RIGHT_X } from './config.js';

// Map a canvas click to panel-local coordinates, or null when the click
// falls outside both picture panels.
export function clickToPanel(clientX, clientY, canvas) {
  const rect = canvas.getBoundingClientRect();
  const x = ((clientX - rect.left) / rect.width) * canvas.width;
  const y = ((clientY - rect.top) / rect.height) * canvas.height;
  if (y < PANEL_Y || y > PANEL_Y + PANEL_H) return null;
  if (x >= PANEL_LEFT_X && x <= PANEL_LEFT_X + PANEL_W) {
    return { panel: 'A', x: x - PANEL_LEFT_X, y: y - PANEL_Y };
  }
  if (x >= PANEL_RIGHT_X && x <= PANEL_RIGHT_X + PANEL_W) {
    return { panel: 'B', x: x - PANEL_RIGHT_X, y: y - PANEL_Y };
  }
  return null;
}

export function attachInput(canvas, handlers) {
  canvas.addEventListener('click', (event) => {
    const hit = clickToPanel(event.clientX, event.clientY, canvas);
    if (hit) handlers.onPanelClick(hit);
  });
  canvas.addEventListener('mousemove', (event) => {
    const hit = clickToPanel(event.clientX, event.clientY, canvas);
    canvas.style.cursor = hit ? 'crosshair' : 'default';
  });
  // Right-clicking the pictures must not open a menu mid-hunt.
  canvas.addEventListener('contextmenu', (event) => event.preventDefault());
  window.addEventListener('keydown', (event) => {
    if (event.repeat) return; // holding a key must not fire hints/retries twice
    const key = event.key.toLowerCase();
    if (key === 'h') handlers.onHint();
    else if (key === 'n') handlers.onNext();
    else if (key === 'r') handlers.onRetry();
    else if (key === 'm') handlers.onMute();
  });
}
