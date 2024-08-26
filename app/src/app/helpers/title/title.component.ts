import { Component, Input } from '@angular/core';
declare var window: Window;

@Component({
  selector: 'app-title',
  standalone: true,
  imports: [],
  providers: [],
  templateUrl: './title.component.html',
  styleUrl: './title.component.scss'
})
export class TitleComponent {
  @Input() backButton = false;
  @Input({ required: true }) title     = 'Título desconocido';
  @Input() subtitle!: string;
  @Input() isForm = false;
  @Input() sticky = false;
  @Input() iconSrc!: string;

  historyBack() {
    window.history.back();
  }
}
