import { Component, computed, signal, inject, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameStateService } from '../../services/game-state.service';

@Component({
  selector: 'app-board-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './board-header.html',
  styleUrls: ['./board-header.css']
})
export class BoardHeader {
  private game = inject(GameStateService);

  points   = () => this.game.points();
  running  = () => this.game.running();
  timeText = () => this.game.timeMs();

  /**
   * Event emitted when the game starts.
   */
  public start() {
    this.game.start();
  }

  /**
   * Event emitted when the game is reset.
   */
  public reset() {
    this.game.reset();
  }

  /**
   * Event emitted when the component is destroyed.
   */
  public ngOnDestroy() {
    this.game.dispose();
  }
}
