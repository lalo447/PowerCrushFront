import { Injectable } from '@angular/core';
import { Dialog } from '@angular/cdk/dialog';
import { AlertDialog } from '../dialogs/alert-dialog/alert-dialog';
import { AlertPlayerName } from '../dialogs/alert-player-name/alert-player-name';

@Injectable({ providedIn: 'root' })
export class AlertService {
  constructor(private dialog: Dialog) {}

  /**
   * Opens a confirmation dialog.
   * @param data - The data for the alert dialog.
   * @returns An observable that emits the user's response.
   */
  public confirm(data: { title?: string; message: string; acceptText?: string; cancelText?: string }) {
    return this.dialog.open<boolean>(AlertDialog, { data }).closed;
  }

  /**
   * Opens a dialog for entering the player's name.
   * @param data - The data for the player name dialog.
   * @returns An observable that emits the user's response.
   */
  public playerName(data: { acceptText?: string; cancelText?: string }) {
    return this.dialog.open<boolean>(AlertPlayerName, { data }).closed;
  }
}
