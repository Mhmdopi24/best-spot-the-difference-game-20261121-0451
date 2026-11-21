// audio.js — synthesized sound effects for Twin Harbor.
// Everything is a WebAudio oscillator: no sound files, no network.
// The context is created lazily on the first user gesture.

export class SoundFX {
  constructor() {
    this.ctx = null;
    this.master = null;
    this.muted = false;
  }

  ensure() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.master = this.ctx.createGain();
        this.master.gain.value = this.muted ? 0 : 1;
        this.master.connect(this.ctx.destination);
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume();
    return this.ctx;
  }

  tone(freq, startAt, duration, type, gainValue) {
    if (this.muted) return;
    const ctx = this.ensure();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.0001, ctx.currentTime + startAt);
    gain.gain.exponentialRampToValueAtTime(gainValue, ctx.currentTime + startAt + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + startAt + duration);
    osc.connect(gain);
    gain.connect(this.master);
    osc.start(ctx.currentTime + startAt);
    osc.stop(ctx.currentTime + startAt + duration + 0.05);
  }

  // A bright two-note chime when a difference is found.
  chime() {
    this.tone(880, 0, 0.22, 'sine', 0.22);
    this.tone(1318, 0.09, 0.3, 'sine', 0.18);
  }

  // A low buzz for a wrong click.
  buzz() {
    this.tone(160, 0, 0.18, 'sawtooth', 0.1);
  }

  // A soft click for buttons and hints.
  click() {
    this.tone(660, 0, 0.07, 'triangle', 0.12);
  }

  // A little rising fanfare when a round is cleared.
  fanfare() {
    this.tone(523, 0, 0.16, 'triangle', 0.18);
    this.tone(659, 0.12, 0.16, 'triangle', 0.18);
    this.tone(784, 0.24, 0.28, 'triangle', 0.2);
  }

  toggleMute() {
    this.muted = !this.muted;
    if (this.master) this.master.gain.value = this.muted ? 0 : 1;
    return this.muted;
  }
}
