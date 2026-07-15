import { Routes } from '@angular/router';

// Routes: '' → HomeComponent (lazy), 'imovel' → ImovelDetailComponent (lazy)
export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/home/home.component').then(m => m.HomeComponent),
  },
  {
    path: 'imovel',
    loadComponent: () =>
      import('./features/imovel-detail/imovel-detail.component').then(
        m => m.ImovelDetailComponent
      ),
  },
];
