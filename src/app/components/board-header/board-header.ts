import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-board-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './board-header.html',
  styleUrls: ['./board-header.css']
})
export class BoardHeader {
  private readonly durationMs = 60_000;

  points  = signal(0);
  running = signal(false);
  timeMs  = signal(this.durationMs);

  private timerId?: ReturnType<typeof setInterval>;
  private endsAt = 0;

  timeText = computed(() => {
    const totalSeconds = Math.floor(this.timeMs() / 1000);
    const mm = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
    const ss = (totalSeconds % 60).toString().padStart(2, '0');
    return `${mm}:${ss}`;
  });

  addPoints(delta: number) {
    this.points.update(p => p + delta);
  }

  start() {
    if (this.running() || this.timeMs() === 0) return;

    this.timeMs.set(this.durationMs);
    this.endsAt = Date.now() + this.durationMs;

    this.running.set(true);
    this.timerId = setInterval(() => {
      const left = this.endsAt - Date.now();
      if (left <= 0) {
        this.timeMs.set(0);
        this.running.set(false);
        clearInterval(this.timerId!);
        this.timerId = undefined;
        return;
      }
      this.timeMs.set(left);
    }, 100);
  }

  reset() {
    if (this.timerId) { clearInterval(this.timerId); this.timerId = undefined; }
    this.running.set(false);
    this.timeMs.set(this.durationMs);
    this.points.set(0);
  }

  ngOnDestroy() {
    if (this.timerId) clearInterval(this.timerId);
  }
}
