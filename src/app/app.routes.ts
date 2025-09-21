import { Routes } from '@angular/router';
import { BoardRankingGame } from './components/board-ranking-game/board-ranking-game';
import { BoardPower } from './components/board-power/board-power';

export const routes: Routes = [
  { path: '', component: BoardRankingGame },
  { path: 'board-power', component: BoardPower },
];
