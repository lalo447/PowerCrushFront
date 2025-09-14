import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-board-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './board-header.html',
  styleUrl: './board-header.css'
})
export class BoardHeader {
  points = signal<number>(0);
  running = signal<boolean>(false);
  timeMs = signal<number>(0);

  private timerId?: ReturnType<typeof setInterval>;
  private startedAt = 0;

  timeText = computed(() => {
    const totalSeconds = Math.floor(this.timeMs() / 1000);
    const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
    const seconds = (totalSeconds % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  });

  public addPoints(delta: number):void{
    this.points.update(p => p + delta);
  }

  public start(): void{
    if (this.running())
      return;

    this.running.set(true);
    this.startedAt = Date.now() - this.timeMs();

    this.timerId = setInterval(() => {
      this.timeMs.set(Date.now() - this.startedAt);
    }, 100);
  }

  public reset(): void{
    if (this.timerId){
      clearInterval(this.timerId);
      this.timerId = undefined;
    }

    this.running.set(false);
    this.timeMs.set(0);
    this.points.set(0);
  }

  public ngOnDestroy(): void{
    if (this.timerId){
      clearInterval(this.timerId);
    }
  }
}
