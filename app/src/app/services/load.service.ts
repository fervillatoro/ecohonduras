import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class LoadService {
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private requestsCount = 0;

  constructor() {}

  public isLoad = this.loadingSubject.asObservable();
  
  /**
   * Componentes que estan cargando
   */
  componentsLoading: string[] = [];

  start(component: string) {
    console.log('startLoading', component);

    this.requestsCount++;
    // console.log('add request:', this.requestsCount);
    
    this.loadingSubject.next(true);
  }

  stop(component: string) {
    console.log('stopLoading', component);

    
    
    this.requestsCount--;
    if (this.requestsCount < 1) {
      this.loadingSubject.next(false);
    }

  }

  closeLoadingBackdrop() {
    const document: any = window.document;
    document.querySelector('html').style.overflow = 'auto';
    document.querySelector('#loading-backdrop')?.classList.add('component-loaded');
  }
}
