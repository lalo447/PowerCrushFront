import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RestfulService } from '../../services/restful.service';
import { Player } from '../../interfaces/Player';
import { AlertService } from '../../services/alert.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-board-ranking-game',
  imports: [CommonModule, RouterLink],
  standalone: true,
  templateUrl: './board-ranking-game.html',
  styleUrls: ['./board-ranking-game.css']
})
export class BoardRankingGame implements OnInit {
  private restful = inject(RestfulService);
  private alert = inject(AlertService);
  public players: Player[] = [];
  public error: string | null = null;

  ngOnInit(): void{
    this.loadRanking();
  }

/**
 * Loads the ranking of players from the RESTful service and handles errors.
 */
  private loadRanking(): void {
  this.restful.get<Player[]>('players')
    .subscribe({
      next: (list) => {
        this.players = list.sort((a, b) => b.points - a.points);
        this.error = null;
      },
      error: (err: HttpErrorResponse) => {
        const apiError = (err?.error ?? {}) as { code?: string; message?: string };

        switch (apiError.code) {
          case 'NotFound':
            this.error = 'No se encontraron jugadores.';
            break;
          default:
            this.error = apiError.message ?? 'Ocurrió un error desconocido.';
            break;
        }

        this.players = [];
        this.alert.confirm({
          title: 'Error',
          message:  this.error,
        }).subscribe();
      }
    });
}
}
