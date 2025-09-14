import { Component, inject } from '@angular/core';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';

type ConfirmData = {
  title?: string;
  message: string;
  acceptText?: string;
  cancelText?: string;
};

@Component({
  standalone: true,
  template: `
    <div class="card">
      <div class="head">
        <h3>{{ data.title || 'Confirmar' }}</h3>
      </div>
      <p class="msg">{{ data.message }}</p>
      <!-- Aceptar primero, luego Cancelar -->
      <div class="actions">
        <button class="btn ok" (click)="ref.close(true)" autofocus>
          {{ data.acceptText || 'Aceptar' }}
        </button>
        <button class="btn cancel" (click)="ref.close(false)">
          {{ data.cancelText || 'Cancelar' }}
        </button>
      </div>
    </div>
  `,
  styles: [`
    .card{width:min(420px,92vw);background:#fff;border-radius:14px;padding:16px;
      box-shadow:0 10px 30px rgba(0,0,0,.12);font-family:ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Arial}
    .head{display:flex;align-items:center;gap:10px;margin-bottom:8px}
    h3{margin:0;font-size:1.05rem;font-weight:700;color:#0f172a}
    .msg{margin:6px 0 14px;color:#374151;line-height:1.45}

    .actions{display:flex;justify-content:flex-end;gap:8px;margin-top:4px}
    .btn{border:0;border-radius:10px;padding:8px 14px;font-weight:600;cursor:pointer;
         transition:transform .06s,opacity .12s}
    .btn:hover{opacity:.95}
    .btn:active{transform:translateY(1px)}
    .ok{background:#111827;color:#fff}
    .cancel{background:#e5e7eb;color:#111827}
  `]
})
export class AlertDialog {
  data = inject<{ title?: string; message: string; acceptText?: string; cancelText?: string }>(DIALOG_DATA);
  ref = inject(DialogRef<boolean>);
}

