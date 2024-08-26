import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonContent, IonHeader, IonInput, IonTitle, IonToolbar, IonGrid, IonRow, IonCol, IonImg, IonCardHeader, IonCardTitle, IonText, IonCardContent, IonItem, IonLabel, IonCheckbox, IonFooter, IonButton, IonCard, IonCardSubtitle, IonList, IonTabBar, IonIcon, IonTabs, IonTabButton, IonProgressBar, IonAvatar, IonButtons, IonSpinner } from '@ionic/angular/standalone';
import { LoadingSpinnerComponent } from 'src/app/helpers/loaders/loading-spinner/loading-spinner.component';
import { FirebaseAuthService } from 'src/app/services/firebase/auth.service';
import { RouterLink } from '@angular/router';
import { API } from 'src/app/interfaces/api';
import { CacheService } from 'src/app/services/cache.service';


const IonicComponents = [
  IonCol,
  IonRow,
  IonGrid,
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonCardHeader,
  IonImg,
  IonInput,
  IonList,
  IonCardSubtitle, IonCard, IonButton,
  IonFooter, IonCheckbox, IonLabel,
  IonItem, IonCardContent, IonText, IonCardTitle
  
];

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    IonSpinner, IonButtons, IonAvatar, IonProgressBar, IonTabButton, IonTabs, IonIcon, IonTabBar,  
    ...IonicComponents,
    CommonModule,
    ReactiveFormsModule,
    LoadingSpinnerComponent,
    RouterLink
  ]
})
export class LoginPage implements OnInit {

  frm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    pwd: new FormControl('', [Validators.required, Validators.minLength(6)])
  });

  constructor(
    private firebaseAuth: FirebaseAuthService,
    private cache: CacheService
  ) {
    this.cache.clear();
  }

  template: 'signup' | 'mail_sent' = 'signup';
  dataHandler: API.DataHandler<{ emailIsVerified: boolean }> = {
    isLoading: false,
    isFinished: false,
    isObtained: false,
    data: null
  };

  login() {
    this.frm.markAllAsTouched();
    const { email, pwd } = this.frm.value;
    if(this.frm.invalid || !email || !pwd) return;
    this.dataHandler.isLoading = true;

    this.firebaseAuth.signIn(email, pwd)
    .then(() => {
      this.dataHandler.isObtained = true;
    })
    .catch(error => {
      console.error('Error during sign in:', error);
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code == 'auth/invalid-credential') {
        this.dataHandler.error = {
          msg: 'Credenciales incorrectas'
        };
      } else {
        this.dataHandler.error = {
          msg: 'Intenta más tarde'
        };
      }
    })
    .finally(() => {
      this.dataHandler.isLoading = false;
      this.dataHandler.isFinished = true;
    });
  }

  ngOnInit(): void {
    
  }

}
