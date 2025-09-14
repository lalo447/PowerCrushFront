import { Component, signal } from '@angular/core';
import { BoardPower } from './components/board-power/board-power';

@Component({
  selector: 'app-root',
  imports: [BoardPower],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('PowerCrushFront');
}
