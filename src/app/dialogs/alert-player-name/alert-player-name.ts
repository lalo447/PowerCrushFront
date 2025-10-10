import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { RestfulService } from '../../services/restful.service';
import { GameStateService } from '../../services/game-state.service';
import { HttpErrorResponse } from '@angular/common/http';
import { DialogData } from '../../types/DialogData';
import { Router } from '@angular/router';

@Component({
  selector: 'app-alert-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './alert-player-name.html',
  styleUrls: ['./alert-player-name.css']
})
export class AlertPlayerName {
  private rest = inject(RestfulService);
  private ref = inject(DialogRef<boolean>);
  public data = inject(DIALOG_DATA) as DialogData;
  private game = inject(GameStateService);
  private router = inject(Router);
  public name: string = '';
  public loading: boolean = false;
  public errorMsg: string | null = null;

  /**
   * Handles the acceptance of the dialog by validating the player's name and submitting it to the RESTful service.
   */
  public onAccept(): void {
    const name = this.name.trim();
    if (!name) {
      this.errorMsg = 'Escribe tu nombre.';
      return;
    }

    this.loading = true;
    this.errorMsg = null;
    const body = { name, points: this.game.points() };

    this.rest.post<boolean, DialogData>('players', body).subscribe({
      next: player => {
          this.ref.close(true);
          this.router.navigate(['']);
      },
      error: (err: HttpErrorResponse) =>
      {
         const apiError = (err?.error ?? {}) as { code?: string; message?: string };
         switch (apiError.code) {
          case 'NotFound':
            this.errorMsg = 'No se inserto la información correctamente, favor de validar nuevamente.';
            break;
          default:
            this.errorMsg = apiError.message ?? 'Ocurrió un error desconocido.';
            break;
        }
          this.loading = false;
      }
    });
  }

  /**
   * Handles the cancellation of the dialog by closing it and returning false.
   */
  public onCancel(): void {
    this.ref.close(false);
  }
}
