import { Component, OnInit } from '@angular/core';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonButtons, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { arrowBack } from 'ionicons/icons';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-licenses',
  templateUrl: './licenses.page.html',
  styleUrls: ['./licenses.page.scss'],
  standalone: true,
  imports: [
    IonIcon, IonButtons, IonButton, IonContent, IonHeader, IonTitle, IonToolbar, RouterLink]
})
export class LicensesPage implements OnInit {
  licenses: string = '';

  constructor() {
    addIcons({ arrowBack });
    fetch('/licenses.txt')
    .then(response => response.text())
    .then(data => {
      this.licenses = data;
    });
  }

  ngOnInit() {
  }

}
