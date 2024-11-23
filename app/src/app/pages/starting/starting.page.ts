import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonText } from '@ionic/angular/standalone';
import { Auth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { SplashScreen } from '@capacitor/splash-screen';

@Component({
  selector: 'app-starting',
  templateUrl: './starting.page.html',
  styleUrls: ['./starting.page.scss'],
  standalone: true,
  imports: [IonText, IonContent, IonHeader, IonTitle, IonToolbar, FormsModule]
})
export class StartingPage implements OnInit {

  constructor(private auth: Auth, private router: Router) {
    this.auth.onAuthStateChanged((user) => user ? this.router.navigate(['/tabs/home'], { replaceUrl: true }) : this.router.navigate(['/accounts/login', { replaceUrl: true }]));
  }

  ngOnInit() {
  }

  ionViewDidEnter = () => SplashScreen.hide();

}
