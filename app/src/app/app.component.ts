import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { LauncherComponent } from './helpers/launcher/launcher.component';
import { NavigationCancel, NavigationEnd, NavigationStart, Router } from '@angular/router';
import { LoadService } from './services/load.service';
import { SplashScreen } from '@capacitor/splash-screen';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [IonRouterOutlet, IonApp, LauncherComponent]
})
export class AppComponent {
  appLoaded = false;

  constructor(
    private router: Router,
    private load: LoadService
  ) {

  //  firebase.getLoginStatus()
  //   .then((loginStatus) => {
  //     console.log(loginStatus);
  //     if(loginStatus) {
  //       this.router.navigate(['/']);
  //     } else {
  //       this.router.navigate(['/accounts/login']);
  //     }
  //   }); 
  }

  ngOnInit() {
    this.router.events
    .subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.load.start('app.component');
      }
      
      if (event instanceof NavigationEnd || event instanceof NavigationCancel) {
        this.load.stop('app.component');
        this.appLoaded = true;
        // SplashScreen.hide();
      }
    });
  }
}
