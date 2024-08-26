import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, getAuth, sendEmailVerification, signInWithEmailAndPassword, updateProfile } from '@angular/fire/auth';
import { signOut, User } from 'firebase/auth';
import { Firestore, doc, setDoc } from '@angular/fire/firestore';
import { UserFirestore } from 'src/app/interfaces/firebase/user-firestore';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class FirebaseAuthService {

  constructor(private auth: Auth, private firestore: Firestore, private router: Router) { }

  async signUp(displayName: string, dni: string, email: string, password: string) {
    const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
    console.log('userCredential', userCredential);

    const user = userCredential.user;
    await updateProfile(this.auth.currentUser as User, { displayName });
    await sendEmailVerification(user);
    await this.saveUserToFirestore({ uid: user.uid, email, displayName, dni, emailVerified: user.emailVerified });
    return ({ success: true });
  }

  async signIn(email: string, password: string) {
    const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
    // Inicio de sesión exitoso
    console.log('Usuario autenticado:', userCredential.user);
    this.router.navigate(['/'], { replaceUrl: true }); // Redirige a la página principal o a un área protegida
  }

  signOut() {
    return signOut(this.auth);
  }

  checkEmailVerification() {
    return this.auth.currentUser?.emailVerified;
  }

  getCurrentUser() {
    return this.auth.currentUser;
  }

  saveUserToFirestore(user: UserFirestore) {
    // Aquí creas o accedes a una colección y documento
    const userDoc = doc(this.firestore, `users/${user.uid}`);
    return setDoc(userDoc, {
      uid: user.uid,
      email: user.email,
      dni: user.dni,
      displayName: user.displayName,
      emailVerified: user.emailVerified
    });
  }



  loginStatus: any | null = null;

  

  /**
   * Verificar el estado del login con firebase
   * @returns Promise<boolean>
   */
  getLoginStatus(): Promise<boolean> {
    if(this.loginStatus) {
      return Promise.resolve(this.loginStatus);
    } else {
      return new Promise((resolve, reject) => {
        resolve(false);
      });

      // return this.get({
      //   route: '/accounts:auth/session',
      //   auth: true
      // })
      // .then(res => res.json())
      // .then(result => {
      //   const loginStatus = {isLogged: result.OK && result.data.id > 0, userInfo: result.data};
      //   this.loginStatus = loginStatus;
      //   return this.loginStatus
      // })
      // .catch((e) => {
      //   console.error(e);
      //   return {isLogged: false, userInfo: null};
      // });
    }

  }

}
