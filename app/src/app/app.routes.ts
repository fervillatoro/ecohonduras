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
  {
    path: 'tabs',
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
    path: '',
    loadComponent: () => import('./pages/starting/starting.page').then( m => m.StartingPage)
  }
  
];
