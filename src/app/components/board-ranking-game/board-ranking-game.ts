import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-board-ranking-game',
  imports: [CommonModule, RouterLink],
  standalone: true,
  templateUrl: './board-ranking-game.html',
  styleUrls: ['./board-ranking-game.css']
})
export class BoardRankingGame {

}
