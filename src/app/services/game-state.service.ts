import { Injectable, signal, computed } from "@angular/core";

@Injectable({
    providedIn: 'root'
})

export class GameStateService{
    private readonly duration = 90_000;
    private readonly durationArrested = 30_000;
    private readonly durationBonus = 10_000;
    private readonly pointsPerMatch = 30;
    private timerId?: ReturnType<typeof setInterval>;
    private endsAt = 0;
    private endAtArrested = 0;
    private endAtMinus = 0;

    public points = signal<number>(0);
    public running = signal<boolean>(false)
    public timeMs = signal<number>(this.duration);

  public timeText = computed(() => {
    const totalSeconds = Math.floor(this.timeMs() / 1000);
    const mm = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
    const ss = (totalSeconds % 60).toString().padStart(2, '0');
    return `${mm}:${ss}`;
  });

  public addPoints(delta: number) {
    if (delta > 0)
        this.points.update(p => p + delta);
  }

   public start() {
    if (this.running() || this.timeMs() === 0)
      return;

    let i = 0;
    this.endsAt = Date.now() + this.duration;
    this.endAtArrested = Date.now() + this.durationArrested;

    this.running.set(true);
    this.timerId = setInterval(() => {
    let left = this.endsAt - Date.now();
    let leftArrested = this.endAtArrested - Date.now();

     if (leftArrested <= 0){
      leftArrested = 0;
      this.endAtArrested = Date.now() + this.durationArrested;
      leftArrested = this.endAtArrested - Date.now();
      i += 1;

      if ((this.pointsPerMatch * i) >= this.points()){
         i -= 1;
         this.endsAt -= this.durationBonus;
      }
     }

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

  public reset() {
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = undefined;
    }
    this.running.set(false);
    this.timeMs.set(this.duration);
    this.points.set(0);
  }

  public dispose() {
    if (this.timerId)
      clearInterval(this.timerId);
  }
}