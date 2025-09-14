import { Component, Input, signal, OnInit } from '@angular/core';
import { CommonModule, NgFor, SlicePipe } from '@angular/common';
import { ProductsService } from '../../services/products.service';
import { Product } from '../../interfaces/Product';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-board-power',
  standalone: true,
  imports: [CommonModule, NgFor, HttpClientModule],
  templateUrl: './board-power.html',
  styleUrls: ['./board-power.css']
})
export class BoardPower implements OnInit {
size = 8;
board = signal<string[]>([]);
loading = signal<boolean>(true);
errorMsg = signal<string | null>(null);

constructor(private productsService: ProductsService) { }

ngOnInit(){
  this.loadProducts();
}

private loadProducts(): void{
  this.productsService.getProducts().subscribe({
    next: (products) =>{
      const valid = (products ?? []).filter(p => !!p.imageUrl);
      if (!valid.length){
        this.errorMsg.set('No products available at the moment.');
        this.loading.set(false);
        return;
      }

      const pool = valid.map(p => p.imageUrl);
      const total = this.size * this.size;
      const board: string[] = [];

      for (let i = 0; i < total; i++){
        const index = Math.floor(Math.random() * pool.length);
        board.push(pool[index]);
      }

      this.board.set(board);
      this.loading.set(false);
    },
    error: () =>{
      this.errorMsg.set('Failed to load products. Please try again later.');
      this.loading.set(false);
    }
  })
}
}
