import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonBackButton, IonButton, IonIcon, ModalController, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, IonAlert, IonActionSheet, IonText } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { arrowBackOutline, scan } from 'ionicons/icons';
import { API } from 'src/app/interfaces/api';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import Tesseract, { createWorker } from 'tesseract.js';
import { ActionSheetButton } from '@ionic/core';
import { ActionSheetController } from '@ionic/angular';

@Component({
  selector: 'app-scanner',
  templateUrl: './scanner.page.html',
  styleUrls: ['./scanner.page.scss'],
  standalone: true,
  imports: [IonText, IonActionSheet, 
    IonAlert, IonCardContent, IonCardSubtitle,
    IonCardTitle, IonCardHeader, IonCard, IonIcon,
    IonButton, IonBackButton, IonButtons, IonContent,
    IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule
  ]
})
export class ScannerPage implements OnInit {
  dataHandlerScanner: API.DataHandler<void> = {
    isLoading: false,
    isFinished: false,
    isObtained: false,
    data: null
  };

  translate: any = {
    client_code: 'Código de cliente',
    kwh: 'Kilowatts-hora'
    // start_date: 'Fecha de facturación inicial',
    // end_date: 'Fecha de facturación final',
    // type_consumption: 'Tipo de consumo'
  };

  readonly ENEEData = ['08019003243825', 'www.eneeutcd.hn'];

  isENEEBill: null | boolean = null;
  isCapturedImage = false;
  isCameraOpened = false;
  srcPreview: string = '';
  text = '';

  /**
   * @description Array of items to check
   * @type {Array<{ name: string, verified: boolean }>}
   * @memberof AddBillComponent
   */
  itemsToCheck: { name: string, value: string, verified: boolean }[] = [];
  scannerSound: HTMLAudioElement = new Audio('./assets/sounds/digital-alarm-2-151919.mp3');

  constructor(
    public modalCtrl: ModalController,
    private actionSheetController: ActionSheetController,
    private cdr: ChangeDetectorRef
  ) {
    addIcons({
      arrowBackOutline,
      scan
    })
  }


  async showActionSheetCameraOptions() {
    const actionSheetButtons: ActionSheetButton[] = [
      { text: 'Desde galería', data: 'photos', handler: () => this.openCamera('photos') },
      { text: 'Tomar foto', data: 'camera', handler: () => this.openCamera('camera')  }
    ];

    const actionSheet = await this.actionSheetController.create({
      header: 'Elige o toma una imagen',
      buttons: actionSheetButtons
    });
    await actionSheet.present();
  }


  takePicture() {
    return Camera.getPhoto({
      quality: 100,
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera, // Solo toma la foto desde la cámara
      correctOrientation: true
    });
  }
  
  selectFromPhotos() {
    return Camera.getPhoto({
      quality: 100,
      resultType: CameraResultType.Uri,
      source: CameraSource.Photos, // Solo selecciona la foto desde la galería
      correctOrientation: true
    });
  }

  // timeout: any = null;
  // setMaxTimeOut() {
  //   this.timeout = setTimeout(() => {
  //     if(this.dataHandlerScanner.isLoading) {
  //       this.dataHandlerScanner.error = {
  //         code: 'timeout',
  //         msg: 'Tiempo de espera agotado'
  //       }
  //       clearTimeout(this.timeout);
  //       this.stop();
  //     }
  //   }, 10000); // 10 segundos
  // }
  

  async openCamera(cameraSource: 'camera' | 'photos') {
    const image = cameraSource === 'camera' ? await this.takePicture() : await this.selectFromPhotos();
    this.srcPreview = '';
      // await Camera.getPhoto({
      //   quality: 100,
      //   resultType: CameraResultType.Uri,
      //   correctOrientation: true
      // });

    const imageUrl = image.webPath!;
    const img = new Image();
    img.src = imageUrl;

    img.onload = () => {
      this.isCapturedImage = true;
      this.srcPreview = img.src;
      this.dataHandlerScanner.isLoading = true;
      this.scannerSound.play();
      this.extractText(img)
      .then(text => {
        console.log('Texto encontrado: ', text, this.itemsToCheck);
        this.searchDataInTextFoundByAI(text);
      })
      .finally(() => {
        this.tesseractWorker?.terminate();
      });
    };
  }


  tesseractWorker: Tesseract.Worker | null = null;

  async extractText(image: HTMLImageElement): Promise<string> {
    this.dataHandlerScanner.error = undefined;

    // this.setMaxTimeOut();
    this.tesseractWorker = await createWorker("spa", 1, {
      logger: m => console.log(m),
    });  
    const { data: { text } } = await this.tesseractWorker.recognize(image);
    return text.trim().toLowerCase();


    // return new Promise((resolve, reject) => {


    //   Tesseract.recognize(image.src, 'spa', { logger: info => console.log(info) } )
    //   .then(({ data: { text } }) => resolve(text))
    //   .catch(error => {
    //     this.stop();
    //     reject(error);
    //   });
    // });
  }
  

  /**
   * @description Search data in text found by AI
   * @memberof AddBillComponent
   * @returns {void}
   */
  searchDataInTextFoundByAI(text: string): void {
    console.log('init searchDataInTextFoundByAI');
    text = text.trim().toLowerCase();

    console.log('Searching data in text found by AI');
    

    this.itemsToCheck = this.itemsToCheck.map((item) => {
      console.log('checking item: ', item);
      let itemVerifing = item;
      itemVerifing.value = itemVerifing.value.toString().toLowerCase().trim();
  
      if(itemVerifing.name == 'start_date' || itemVerifing.name == 'end_date') {
        /**
         * Formatear fecha de {año-mes-dia} a {dia/mes/año}
         * Solo para usar durante la verificacion
         */
        itemVerifing.value = itemVerifing.value.split('-').reverse().join('/');
      }
      
      if(itemVerifing.value != '' && text.includes( itemVerifing.value)) {
        console.log('Item verified: ',  itemVerifing);
        item.verified = true;
      }
  
      
      console.log('checking item finished: ',  itemVerifing);
      return item;
    });

    /**
     * Verificar que sea de la enee
     */
    /**
     * @PENDING
     */
      


    console.log(this.itemsToCheck);

    /**
     * @description Check if all items are verified
     */
    this.dataHandlerScanner.isObtained = this.itemsToCheck.filter(item => item.verified === true).length === this.itemsToCheck.length;
    this.dataHandlerScanner.isFinished = true;

    if(this.dataHandlerScanner.isObtained) {
      this.modalCtrl.dismiss(this.dataHandlerScanner);
      this.stop();
    }
  }

  stop() {
    console.log('Worker stopped');
    
    this.srcPreview = '';
    this.isCapturedImage = false;
    this.dataHandlerScanner = {
      isLoading: false,
      isFinished: false,
      isObtained: false,
      data: null
    };

    this.scannerSound.pause();
    this.tesseractWorker?.terminate();
    this.cdr.detectChanges();
  }



  ngOnInit() {
    this.scannerSound.loop = true;
  }

}
