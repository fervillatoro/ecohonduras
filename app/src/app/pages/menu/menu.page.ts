import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonTitle, IonButton, IonIcon, IonCard, IonButtons, IonText, IonToolbar, IonHeader } from '@ionic/angular/standalone';
import { RouterLink } from '@angular/router';
import { Auth } from '@angular/fire/auth';
import { addIcons } from 'ionicons';
import { bulbOutline, flashOutline, newspaperOutline } from 'ionicons/icons';
import { App } from '@capacitor/app';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar,  
    IonText, IonButtons, IonCard, IonIcon, IonButton, IonContent, IonTitle, CommonModule, FormsModule,
    RouterLink
  ]
})
export class MenuPage implements OnInit {

  constructor(public firebaseAuth: Auth) {
    addIcons({
      flashOutline,
      bulbOutline,
      newspaperOutline
    });
  }

  appVersion: string = '';
  async getAppVersion() {
    const info = await App.getInfo();
    this.appVersion = info.version;
    console.log('App Version:', this.appVersion);
  }

  ngOnInit() {
    this.getAppVersion();
  }

}
