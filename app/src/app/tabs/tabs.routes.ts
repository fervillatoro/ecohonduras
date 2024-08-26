import { Routes } from '@angular/router';
import { TabsPage } from './tabs.page';
import { FirebaseAuthCheckGuard } from '../guards/firebase-auth-check.guard';

export const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    canActivate: [FirebaseAuthCheckGuard],

    children: [
      {
        path: 'home',
        loadComponent: () => import('./../pages/home/home.page').then( m => m.HomePage)
      },
      {
        path: 'history',
        loadComponent: () => import('./../pages/history/history.page').then( m => m.HistoryPage)
      },
      {
        path: 'carbon-footprint',
        loadComponent: () => import('./../pages/carbon-footprint/carbon-footprint.page').then( m => m.CarbonFootprintPage)
      },
      {
        path: 'tips',
        loadComponent: () => import('./../pages/tips/tips.page').then( m => m.TipsPage)
      },
      {
        path: 'menu',
        loadComponent: () => import('./../pages/menu/menu.page').then( m => m.MenuPage)
      },
      {
        path: '',
        redirectTo: '/tabs/home',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: '/tabs/home',
    pathMatch: 'full',
  },
];
