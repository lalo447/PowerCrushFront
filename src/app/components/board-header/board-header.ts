import { Component, computed, signal, inject } from '@angular/core';
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

  public start() {
    this.game.start();
  }

  public reset() {
    this.game.reset();
  }

  ngOnDestroy() {
    this.game.dispose();
  }
}
