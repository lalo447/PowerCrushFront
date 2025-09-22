import { Component, Input, signal, OnInit, inject } from '@angular/core';
import { CommonModule, NgFor, SlicePipe } from '@angular/common';
import { RestfulService } from '../../services/restful.service';
import { HttpClientModule } from '@angular/common/http';
import { BoardHeader } from '../board-header/board-header';
import { AlertService } from '../../services/alert.service';
import { GameStateService } from '../../services/game-state.service';
import { environment } from '../../../enviroment.ts/enviroment';
import { Product } from '../../interfaces/Product';

@Component({
  selector: 'app-board-power',
  standalone: true,
  imports: [CommonModule, NgFor, HttpClientModule, BoardHeader],
  templateUrl: './board-power.html',
  styleUrls: ['./board-power.css']
})
export class BoardPower implements OnInit {
public error = signal<string | null>(null);
public board = signal<(string | null)[]>([]);
private readonly size = environment.size;
private selectedIndex = signal<number | null>(null);
private lastProbedRuns = signal<number[][] | null>(null);
private game = inject(GameStateService);
private alert = inject(AlertService);
private pool: string[] = [];
public started = signal<boolean>(false);

constructor(
  private restfulService: RestfulService
) { }

/**
 * Lifecycle hook that is called after data-bound properties of a directive are initialized.
 * Here, it is used to load products and set up a subscription to game start changes.
 */
ngOnInit(){
  this.loadProducts();
  this.game.startChange$.subscribe(started => {
    this.started.set(started);
  });
}

/**
 * Handles changes to the game's start state.
 * @param started - A boolean indicating whether the game has started or not.
 */
public onStartChange(started: boolean) {
  this.started.set(started);
}
/**
 * Loads products from the RESTful service and initializes the game board.
 */
private loadProducts(): void{
  this.restfulService.get<Product>('/products.json').subscribe({
    next: (products) =>{
      const pool = products.map(p => p.imageUrl);
      const total = this.size * this.size;
      const board: string[] = [];

      for (let i = 0; i < total; i++){
        const index = Math.floor(Math.random() * pool.length);
        board.push(pool[index]);
      }

      this.board.set(board);
      const poolNotCopy = Array.from(new Set(pool));
      const boardGenerate: string [] = new Array(total);

      for (let i = 0; i < total; i++) {
        const index = Math.floor(Math.random() * poolNotCopy.length);
        boardGenerate[i] = poolNotCopy[index];
      }

       this.pool = boardGenerate;
    },
    error: () =>{
      this.error.set('Failed to load products. Please try again later.');
      this.alert
          .confirm({
            title: 'Error',
            message: 'Fallo el cargar productos, favor de volver a intentarlo.'
          })
          .subscribe();
    }
  })
}

/**
 * Handles a cell click event.
 * @param i - The index of the clicked cell.
 * @param img - The image associated with the clicked cell.
 */
public onCellClick(i: number, img: string): void {
  if (!this.game.isStarted){
    this.alert.confirm({
      title: 'Atención',
      message: 'El juego no ha iniciado, favor de iniciar el juego.'
  });
  return;
  }

  const firstIndex = this.selectedIndex();
  if (firstIndex === null) {
    this.selectedIndex.set(i);
    return;
  }

  const secondIndex = i;
  if (!this.areAdjacent(firstIndex, secondIndex)) {
    this.selectedIndex.set(secondIndex);
    return;
  }
  const copyBoard = [...this.board()];
  this.exChangeItems(copyBoard, firstIndex, secondIndex);

  const sameImages = this.findSameImages(copyBoard);
  this.lastProbedRuns.set(sameImages);
  this.board.set(copyBoard);

  this.processAfterSeachSameImages(firstIndex, secondIndex, sameImages);
  this.selectedIndex.set(null);
}

/**
 * Checks if two indices are adjacent on the game board.
 * @param first - The first index.
 * @param second - The second index.
 * @returns True if the indices are adjacent, false otherwise.
 */
private areAdjacent(first: number, second: number): boolean {
  const diferent = Math.abs(first - second);
  if (diferent === this.size)
    return true;

  if (diferent === 1){
    const rowA = Math.floor(first / this.size);
    const rowB = Math.floor(second / this.size);
    return rowA === rowB;
  }
  return false;
}

/**
 * Exchanges two items in an array.
 * @param arr - The array in which to exchange items.
 * @param first - The index of the first item.
 * @param second - The index of the second item.
 */
private exChangeItems(arr: (string | null)[], first: number, second: number): void {
  [arr[first], arr[second]] = [arr[second], arr[first]];
}

private findSameImages(cells: (string | null)[]): number[][] {
  const rows = Math.ceil(cells.length / this.size);
  const runs: number[][] = [];

  // --- Horizontal ---
  for (let r = 0; r < rows; r++) {
    let start = r * this.size;
    let prev = start;
    let streak = 1;
    for (let c = 1; c < this.size; c++) {
      const i = r * this.size + c;

      if (i >= cells.length)
        break;

      if (cells[i] === cells[prev])
        streak++;

      if(cells[i] !== cells[prev]) {
        if (streak >= 3) {
          const tramo: number[] = [];
          for (let k = i - streak; k < i; k++)
            tramo.push(k);

          runs.push(tramo);
        }
        streak = 1;
      }
      prev = i;
    }

    const rowEnd = Math.min((r + 1) * this.size - 1, cells.length - 1);
    if (streak >= 3) {
      const tramo: number[] = [];
      for (let k = rowEnd - streak + 1; k <= rowEnd; k++)
        tramo.push(k);

      runs.push(tramo);
    }
  }

  // --- Vertical ---
  for (let c = 0; c < this.size; c++) {
    let prev = c;
    let streak = 1;

    for (let r = 1; r < rows; r++) {
      const i = r * this.size + c;
      if (i >= cells.length)
        break;

      if (cells[i] === cells[prev])
        streak++;

      if (cells[i] !== cells[prev]){
        if (streak >= 3) {
        const tramo: number[] = [];
        for (let k = i - this.size * streak; k < i; k += this.size)
          tramo.push(k);

        runs.push(tramo);
      }
      streak = 1;
      }
      prev = i;
    }
    const lastRowIndex = (rows - 1) * this.size + c;
    if (lastRowIndex < cells.length && streak >= 3) {
      const tramo: number[] = [];
      for (let k = lastRowIndex - this.size * (streak - 1); k <= lastRowIndex; k += this.size) tramo.push(k);
      runs.push(tramo);
    }
  }
  return runs;
}

/**
 * Processes the game board after searching for matching images.
 * @param first - The index of the first selected item.
 * @param second - The index of the second selected item.
 * @param sameImages - The list of matching image groups.
 */
private processAfterSeachSameImages(first: number, second: number, sameImages: number[][]): void {
  const movedSet = new Set([first, second]);
  const validateStreaks = sameImages.filter(sameImage => sameImage.some(idx => movedSet.has(idx)));

  if (validateStreaks.length === 0){
    const revertedBoard = [...this.board()];
    this.exChangeItems(revertedBoard, first, second);
    this.board.set(revertedBoard);
    return;
  }

  const toRemove = this.flattenToSet(validateStreaks);
  const earned = toRemove.size * 10;

  if (this.game.running() && this.game.timeMs() > 0) {
    this.game.addPoints(earned);
  }

  const afterRemove = [...this.board()];
  toRemove.forEach((i: number) => {
    if (i >= 0 && i < afterRemove.length)
      afterRemove[i] = null;
  });
   this.collapseAndRefill(afterRemove);

  this.board.set(afterRemove);
  this.lastProbedRuns.set([]);
  this.selectedIndex.set(null);
}

/**
 * Flattens an array of arrays into a Set.
 * @param runs - The array of arrays to flatten.
 * @returns A Set containing all unique values from the input arrays.
 */
private flattenToSet(runs: number[][]): Set<number> {
  const streak = new Set<number>();
  for (const run of runs) {
    for (const idx of run)
      streak.add(idx);
  }
  return streak;
}

/**
 * Collapses and refills the game board array.
 * @param arr - The game board array to collapse and refill.
 */
private collapseAndRefill(arr: (string | null)[]): void {
  if (!arr.length || this.size <= 0){
    this.alert.confirm({
      title: 'Error',
      message: 'Tamaño del tablero inválido, favor de validar.'
    })
    .subscribe();
    return;
  }

  if (!this.pool || this.pool.length === 0) {
       this.alert.confirm({
        title: 'Error',
        message: 'No hay productos disponibles para rellenar el tablero.'
      })
    .subscribe();
    return;
  }

  const rows = Math.ceil(arr.length / this.size);

  for (let c = 0; c < this.size; c++) {
    const colBottom = (rows - 1) * this.size + c;
    let write = colBottom;
    for (let r = rows - 1; r >= 0; r--) {
      const i = r * this.size + c;
      if (i >= arr.length) continue;
      const val = arr[i];
      if (val !== null && val !== undefined) {
        if (write !== i) {
          arr[write] = val;
          arr[i] = null;
        }
        write -= this.size;
      }
    }
    for (let i = write; i >= c; i -= this.size) {
      if (i < 0) break;
      if (i >= arr.length) continue;
      const idx = Math.floor(Math.random() * this.pool.length);
      arr[i] = this.pool[idx];
    }
  }
}
}
