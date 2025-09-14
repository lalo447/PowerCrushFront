import { Component, Input, signal, OnInit } from '@angular/core';
import { CommonModule, NgFor, SlicePipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ProductsService } from '../../services/products.service';
import { Product } from '../../interfaces/Product';

@Component({
  selector: 'app-board-power',
  standalone: true,
  imports: [CommonModule, NgFor, HttpClientModule],
  templateUrl: './board-power.html',
  styleUrls: ['./board-power.css']
})
export class BoardPower implements OnInit {
  @Input() size = 8;
  @Input() moves = 30;
  @Input() target = 3000;
  @Input() score = 0;
  @Input() typesCount = 6;

  products = signal<Product[]>([]);
  uiBoard = signal<string[]>([]);
  legend  = signal<string[]>([]);

  constructor(private productsService: ProductsService) {}

  ngOnInit() {
    this.productsService.getProducts().subscribe({
      next: (data) => {
        const valid = (data ?? []).filter(p => !!p.imageUrl);
        this.products.set(valid);
        this.generateUiBoard();
      },
      error: (err) => {
        console.error('Error cargando products.json', err);
      }
    });
  }

  private pickN<T>(arr: T[], n: number): T[] {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a.slice(0, n);
  }

  private shuffle<T>(a: T[]): void {
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
  }

  private avoidStartingMatches(arr: string[]) {
    const n = this.size;
    const idx = (r: number, c: number) => r * n + c;
    const get = (r: number, c: number) => arr[idx(r, c)];

    for (let r = 0; r < n; r++) {
      for (let c = 0; c < n; c++) {
        const k = idx(r, c);
        while (
          (c >= 2 && get(r, c) === get(r, c - 1) && get(r, c) === get(r, c - 2)) ||
          (r >= 2 && get(r, c) === get(r - 1, c) && get(r, c) === get(r - 2, c))
        ) {
          const swapWith = Math.floor(Math.random() * arr.length);
          [arr[k], arr[swapWith]] = [arr[swapWith], arr[k]];
        }
      }
    }
  }

  generateUiBoard() {
    const all = this.products();
    if (!all.length) return;

    const total = this.size * this.size;

    // 1) Elige pocos tipos
    const selected = this.pickN(all, Math.min(this.typesCount, all.length));
    const pool = selected.map(p => p.imageUrl);
    this.legend.set(pool); // para la leyenda

    // 2) Reparte balanceado (mismos tipos repetidos muchas veces)
    const reps = Math.ceil(total / pool.length);
    const board: string[] = [];
    for (let r = 0; r < reps; r++) board.push(...pool);
    board.length = total;     // recorta
    this.shuffle(board);      // aleatoriza

    // 3) Opcional: evita comenzar con matches gratis
    this.avoidStartingMatches(board);

    this.uiBoard.set(board);
  }
}
