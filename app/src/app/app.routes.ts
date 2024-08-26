import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'accounts',
    children: [
      {
        path: 'login',
        loadComponent: () => import('./pages/accounts/login/login.page').then( m => m.LoginPage)
      },
      {
        path: 'signup',
        loadComponent: () => import('./pages/accounts/signup/signup.page').then( m => m.SignupPage)
      },
    ]
  },
  // {
  //   path: 'navbar',
  //   canActivate: [FirebaseAuthCheckGuard],
  //   loadComponent: () => import('./helpers/navbar/navbar.component').then( m => m.NavbarComponent),
  //   children: [
  //     {
  //       path: 'challenges',
  //       loadComponent: () => import('./components/challenges/challenges.component').then( m => m.ChallengesComponent)
  //     },
  //     {
  //       path: 'calculator',
  //       loadComponent: () => import('./components/calculator/calculator.component').then( m => m.CalculatorComponent)
  //     },
  //     {
  //       path: 'monitoring',
  //       loadComponent: () => import('./components/monitoring/monitoring.component').then( m => m.MonitoringComponent)
  //     },
  //     {
  //       path: 'menu',
  //       loadComponent: () => import('./components/menu/menu.component').then( m => m.MenuComponent)
  //     },
      
  //     {
  //       path: '',
  //       redirectTo: 'home', // Ruta por defecto
  //       pathMatch: 'full'
  //     }
  //   ]
  // },
  
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.routes').then((m) => m.routes),
  },
  {
    path: 'mail-sent',
    loadComponent: () => import('./pages/accounts/signup/mail-sent/mail-sent.page').then( m => m.MailSentPage)
  },
  {
    path: 'licenses',
    loadComponent: () => import('./pages/licenses/licenses.page').then( m => m.LicensesPage)
  },
  {
    path: 'ranking',
    loadComponent: () => import('./pages/ranking/ranking.page').then( m => m.RankingPage)
  }
  
];
