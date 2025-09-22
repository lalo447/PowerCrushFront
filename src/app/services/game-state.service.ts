import { Injectable, signal, computed, inject } from "@angular/core";
import { AlertService } from "./alert.service";
import { BehaviorSubject } from "rxjs";
import { environment } from '../../enviroment.ts/enviroment';

@Injectable({
    providedIn: 'root'
})

export class GameStateService{
    private readonly duration = environment.duration;
    private readonly durationArrested = environment.durationArrested;
    private readonly durationBonus = environment.durationBonus;
    private readonly pointsPerMatch = environment.pointsPerMatch;
    private timerId?: ReturnType<typeof setInterval>;
    private endsAt = 0;
    private endAtArrested = 0;
    private alert = inject(AlertService);
    public points = signal<number>(0);
    public running = signal<boolean>(false)
    public timeMs = signal<number>(this.duration);
    private _startChange = new BehaviorSubject<boolean>(false);
    readonly startChange$ = this._startChange.asObservable();
    get isStarted(): boolean { return this._startChange.value; }

  /**
   * Returns the formatted time text.
   */
  public timeText = computed(() => {
    const totalSeconds = Math.floor(this.timeMs() / 1000);
    const mm = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
    const ss = (totalSeconds % 60).toString().padStart(2, '0');
    return `${mm}:${ss}`;
  });

  /**
   * Adds points to the current score.
   * @param delta - The number of points to add.
   */
  public addPoints(delta: number) {
    if (delta > 0)
        this.points.update(p => p + delta);
  }

  /**
   * Starts the game.
   */
   public start() {
    this._startChange.next(true);
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
         this._startChange.next(false);
        this.alert.playerName({});
        this.timeMs.set(0);
        this.running.set(false);
        clearInterval(this.timerId!);
        this.timerId = undefined;
        return;
      }
      this.timeMs.set(left);
    }, 100);
  }

  /**
   * Resets the game state.
   */
  public reset() {
    this._startChange.next(false);
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = undefined;
    }
    this.running.set(false);
    this.timeMs.set(this.duration);
    this.points.set(0);
  }

  /**
   * Cleans up resources when the service is disposed.
   */
  public dispose() {
    if (this.timerId)
      clearInterval(this.timerId);
  }
}