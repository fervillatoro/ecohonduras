import { Component, OnInit } from '@angular/core';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonList, IonItem, IonIcon, IonLabel, IonText, IonButton, IonButtons, IonModal, IonAccordionGroup, IonAccordion, IonCard, IonCardTitle, IonCardHeader, IonCardContent } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { arrowBack, power, sunny, thermometerOutline, water } from 'ionicons/icons';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-tips',
  templateUrl: './tips.page.html',
  styleUrls: ['./tips.page.scss'],
  standalone: true,
  imports: [IonCardContent, IonCardHeader, IonCardTitle, IonCard, IonAccordion, IonAccordionGroup, IonModal, 
    IonButtons, IonButton, IonText,
    IonLabel, IonIcon, IonItem, IonList,
    IonContent, IonHeader, IonTitle, IonToolbar,
    RouterLink
  ]
})
export class TipsPage implements OnInit {

  constructor() {
    addIcons({
      arrowBack,
      thermometerOutline,
      water,
      sunny,
      power,
      'foco-fluorescente': 'assets/md-icons/foco-fluorescente.svg',
      'foco-incandescente': 'assets/md-icons/foco-incandescente.svg',
      'foco-led': 'assets/md-icons/foco-led.svg',
      'lightbulb': 'assets/md-icons/lightbulb_24dp_E8EAED_FILL1_wght400_GRAD0_opsz24.svg',
    });
  }

  ngOnInit() {
  }

}
