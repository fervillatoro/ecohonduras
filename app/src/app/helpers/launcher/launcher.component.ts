import { Component, Input, OnInit } from '@angular/core';
import { LoadingBarComponent } from '../loaders/loading-bar/loading-bar.component';

@Component({
  standalone: true,
  imports: [
    LoadingBarComponent
  ],
  selector: 'app-launcher',
  templateUrl: './launcher.component.html',
  styleUrls: ['./launcher.component.scss'],
})
export class LauncherComponent  implements OnInit {
  @Input() appLoaded = false;

  constructor() { }

  ngOnInit() {
  }

}
