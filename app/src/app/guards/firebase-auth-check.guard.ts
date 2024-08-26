// import { CanActivateFn } from '@angular/router';

// export const FirebaseAuthCheckGuard: CanActivateFn = (route, state) => {
//   return true;
// };



import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Auth } from '@angular/fire/auth';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FirebaseAuthCheckGuard implements CanActivate {
  constructor(private auth: Auth, private router: Router) {}

  loginStatus: 'CONNECTED' | 'DISCONNECTED' | null = null;

  canActivate() {
    return new Observable<boolean>((observer) => {
      this.auth.onAuthStateChanged((user) => {
        if (user) {
          observer.next(true);
        } else {
          this.router.navigate(['/accounts/login']);
          observer.next(false);
        }
        observer.complete();
      });
    });
  }
}