import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import {
  IonContent, IonHeader, IonTitle, IonToolbar,
  IonGrid, IonRow, IonCol, IonCard, IonCardHeader,
  IonCardTitle, IonCardSubtitle, IonCardContent,
  IonInput, IonItem, IonCheckbox, IonButton, IonSpinner, IonText,
  ModalController
} from '@ionic/angular/standalone';
import { API } from 'src/app/interfaces/api';
import { FirebaseAuthService } from 'src/app/services/firebase/auth.service';
import { MailSentPage } from './mail-sent/mail-sent.page';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
  standalone: true,
  imports: [IonText, IonSpinner, IonButton, IonCheckbox, IonItem, 
    IonCardContent, IonCardSubtitle, IonCardTitle,
    IonCardHeader, IonCard, IonCol, IonRow, IonGrid,
    IonContent, IonHeader, IonTitle, IonToolbar,
    ReactiveFormsModule,
    IonInput,
    RouterLink
  ]
})
export class SignupPage implements OnInit {

  frm = new FormGroup({
    fullname: new FormControl('', [Validators.required, Validators.minLength(3)]),
    dni: new FormControl('', [Validators.required, Validators.minLength(13), Validators.maxLength(13)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    pwd: new FormControl('', [Validators.required, Validators.minLength(6)]),
  });

  constructor(
    private firebaseAuth: FirebaseAuthService,
    private modalCtrl: ModalController
  ) {
  }

  template: 'signup' | 'mail_sent' = 'signup';
  dataHandler: API.DataHandler<void> = {
    isLoading: false,
    isFinished: false,
    isObtained: false,
    data: null
  };

  create() {
    this.frm.markAllAsTouched();
    const { fullname, dni, email, pwd } = this.frm.value;
    if(this.frm.invalid || !fullname || !email || !pwd || !dni) return;

    this.dataHandler.isLoading = true;

    this.firebaseAuth.signUp(fullname, dni, email, pwd)
    .then(()     => {
      this.modalCtrl.create({
         component: MailSentPage,
         componentProps: {
           email
         }
       }).then(modal => {
         modal.present();
      });
    })
    .catch(error => {
      console.error('Error during sign up:', error);
      if (error.code === 'auth/email-already-in-use') {
        this.dataHandler.error = {
          msg: 'La cuenta ya existe'
        };
      } else {
        this.dataHandler.error = {
          msg: 'Intenta más tarde'
        };
      }
    })
    .finally(() => {
      this.dataHandler.isLoading = false;
    });
  }

  ngOnInit() {}

}
