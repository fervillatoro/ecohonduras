import { Component, OnInit } from '@angular/core';
import { IonContent, IonHeader, ModalController, IonTitle, IonToolbar, IonCard, IonCardTitle, IonCardHeader, IonIcon, IonCardContent, IonButton } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { checkmarkCircle } from 'ionicons/icons';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-mail-sent',
  templateUrl: './mail-sent.page.html',
  styleUrls: ['./mail-sent.page.scss'],
  standalone: true,
  imports: [
    IonButton, IonCardContent,
    IonIcon, IonCardHeader, IonCardTitle,
    IonCard, IonContent, IonHeader, IonTitle,
    IonToolbar, RouterLink
  ]
})
export class MailSentPage implements OnInit {

  constructor(public modalCtrl: ModalController) {
    addIcons({
      checkmarkCircle
    });
  }

  ngOnInit() {
  }

}
