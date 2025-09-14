import { Routes } from '@angular/router';

export const routes: Routes = [
    { path: '',
    loadComponent: () =>
    import('./components/board-power/board-power').then(m => m.BoardPower) }
];
