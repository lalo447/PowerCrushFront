import { Component, inject } from '@angular/core';
import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';

@Component({
  selector: 'app-alert-dialog',
  standalone: true,
  templateUrl: './alert-dialog.html',
  styleUrls: ['./alert-dialog.css']
})
export class AlertDialog {
  data = inject(DIALOG_DATA) as { title?: string; message: string; acceptText?: string; cancelText?: string };
  ref = inject(DialogRef<boolean>);
}
