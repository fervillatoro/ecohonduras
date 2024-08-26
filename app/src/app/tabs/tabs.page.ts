import { Component, EnvironmentInjector, inject } from '@angular/core';
import { IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { home, menu } from 'ionicons/icons';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
  standalone: true,
  imports: [IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel],
})
export class TabsPage {
  public environmentInjector = inject(EnvironmentInjector);

  constructor() {
    addIcons({
      home,
      menu,
      'foot': '/assets/md-icons/barefoot_24dp_E8EAED_FILL1_wght400_GRAD0_opsz24.svg',
      'offline-bolt': '/assets/md-icons/offline_bolt_24dp_E8EAED_FILL1_wght400_GRAD0_opsz24.svg',
    });
  }
}
