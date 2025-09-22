import { Component, inject } from '@angular/core';
import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';

@Component({
  selector: 'app-alert-dialog',
  standalone: true,
  templateUrl: './alert-player-name.html',
  styleUrls: ['./alert-player-name.css']
})
export class AlertPlayerName {
  data = inject(DIALOG_DATA) as { acceptText?: string; cancelText?: string };
  ref = inject(DialogRef<boolean>);
}
