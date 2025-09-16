import { Component, Input, signal, OnInit, inject } from '@angular/core';
import { CommonModule, NgFor, SlicePipe } from '@angular/common';
import { ProductsService } from '../../services/products.service';
import { HttpClientModule } from '@angular/common/http';
import { BoardHeader } from '../board-header/board-header';
import { AlertDialog } from '../../services/alert.service';
import { Dialog } from '@angular/cdk/dialog';

@Component({
  selector: 'app-board-power',
  standalone: true,
  imports: [CommonModule, NgFor, HttpClientModule, BoardHeader],
  templateUrl: './board-power.html',
  styleUrls: ['./board-power.css']
})
export class BoardPower implements OnInit {
size = 8;
board = signal<string[]>([]);
error = signal<string | null>(null);
 private dialog = inject(Dialog);

constructor(
  private productsService: ProductsService
) { }

ngOnInit(){
  this.loadProducts();
}

private loadProducts(): void{
  this.productsService.getProducts().subscribe({
    next: (products) =>{
      const pool = products.map(p => p.imageUrl);
      const total = this.size * this.size;
      const board: string[] = [];

      for (let i = 0; i < total; i++){
        const index = Math.floor(Math.random() * pool.length);
        board.push(pool[index]);
      }

      this.board.set(board);
    },
    error: () =>{
      this.error.set('Failed to load products. Please try again later.');
      this.dialog.open(AlertDialog, { data: { title: 'Error', message: 'Failed to load products. Please try again later.' } });
    }
  })
}
}
