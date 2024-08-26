import { Component, Input, SimpleChanges } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';
import { Item } from './navbar';
import { DomSanitizer } from '@angular/platform-browser';
import { LoadingBarComponent } from '../loaders/loading-bar/loading-bar.component';
import { environment } from 'src/environments/environment.prod';
import { LoadService } from 'src/app/services/load.service';
import { IonIcon } from "@ionic/angular/standalone";
import { addIcons } from 'ionicons';
import { bulb, bulbOutline, fingerPrint, fingerPrintOutline, flash, flashOutline, home, homeOutline, menu, menuOutline } from 'ionicons/icons';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [IonIcon, AsyncPipe, LoadingBarComponent, RouterLink, RouterOutlet],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  @Input() items: Item[] = [];
  itemsWithSafeHtml: Item[] = [];

  location: Location = location;
  
  isLoadApp = true;
  logoURL   = environment.api.url.staticAssets.logoDark;
  logoURLMobile   = environment.api.url.staticAssets.logo;

  constructor(
    private sanitizer: DomSanitizer,
    public load: LoadService
  ) {
    addIcons({
      home,
      homeOutline,
      fingerPrint,
      fingerPrintOutline,
      bulb,
      bulbOutline,
      flash,
      flashOutline,
      menu,
      menuOutline
    });

    load.isLoad.subscribe((isLoad) => {
      this.isLoadApp = isLoad;
      console.log(isLoad);
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['items']) {
      this.itemsWithSafeHtml = this.items.map(item => {
        const { icon, ...remainingValues } = item;
        if(!icon) return item;

        const safeHtml = this.sanitizer.bypassSecurityTrustHtml(icon.toString());

        return { icon: safeHtml, ...remainingValues };
      });
    }
  }
}
