import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControlOptions, FormBuilder } from '@angular/forms';
import { IonContent, LoadingController, ToastController, IonSelect, IonHeader, IonTitle, IonSelectOption, IonToolbar, IonInput, IonButtons, IonButton, IonItem, IonNote, IonLabel, IonFooter, IonText, IonList, IonModal, IonIcon, IonAlert, IonLoading, IonCardContent, IonCard, IonCardTitle, IonCardHeader, IonCardSubtitle, IonDatetime, IonDatetimeButton, IonRow, IonCol, IonGrid } from '@ionic/angular/standalone';
import { API } from 'src/app/interfaces/api';
import { ModalController } from '@ionic/angular';
import { FirestoreService } from 'src/app/services/firebase/firestore.service';
import { FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Auth } from '@angular/fire/auth';
import { EnergyHistoryByMonth } from 'src/app/interfaces/energy_history_by_month';
import { Bill } from 'src/app/interfaces/bill';
import { ScannerPage } from '../scanner/scanner.page';
import { format, parseISO } from 'date-fns';
import { dateRangeValidator } from 'src/app/validators/date-range.validator';


@Component({
  selector: 'app-add-bill',
  templateUrl: './add-bill.page.html',
  styleUrls: ['./add-bill.page.scss'],
  standalone: true,
  imports: [IonGrid, IonCol, IonRow, IonDatetimeButton, IonDatetime, 
    IonCardSubtitle, IonCardHeader, IonCardTitle, IonCard, IonCardContent,
    IonLoading, IonAlert, IonIcon, IonModal, IonList, IonText, 
    IonFooter, IonLabel, IonNote, IonItem, IonButton, IonButtons, IonContent,
    IonHeader, IonTitle, IonToolbar, CommonModule,
    ReactiveFormsModule,
    IonSelectOption,
    IonInput,
    IonSelect
  ],
  providers: [
    ModalController
  ]
})
export class AddBillPage implements OnInit {
  dataHandler: API.DataHandler<void> = {
    isLoading: false,
    isFinished: false,
    isObtained: false,
    data: null
  };

  currentdate = '';
  frm: FormGroup;
  rtnEnee = '08019003243825';

  constructor(
    private firestore: FirestoreService,
    private firebaseAuth: Auth,
    protected modalCtrl: ModalController,
    private fb: FormBuilder,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController
  ) {
    const controlOptions: AbstractControlOptions = {
      validators: dateRangeValidator()
    };

    this.frm = this.fb.group({
      client_code: ['', [Validators.required, Validators.minLength(6)]],
      kwh: ['', [Validators.required, Validators.min(1)]],
      billing_date_from: [new Date().toISOString(), [Validators.required]],
      billing_date_to: [new Date().toISOString(), [Validators.required]],
      type_consumption: ['residential', Validators.required]
    }, controlOptions);
  }

  

  async continueToVerify() {
    this.dataHandler.error = undefined;
    this.frm.markAllAsTouched();
    
    // if(this.frm.hasError('dateRangeInvalid')) {
    //   this.dataHandler.error = {
    //     msg: 'El rango de fechas debe ser de 30 días'
    //   };
    // }

    if(this.frm.invalid) return;
    
    const modal = await this.modalCtrl.create({
      component: ScannerPage,
      componentProps: {
        itemsToCheck: [
          {
            name: 'client_code', value: this.frm.value.client_code ?? '', verified: false,
          },
          {
            name: 'kwh', value: this.frm.value.kwh ?? '', verified: false
          }
        ]
      }
    });

    modal.onDidDismiss<API.DataHandler<void>>().then((result) => {
      console.log('modal.onDidDismiss', result);
      if(result.data?.isObtained) {
        this.saveBill();
      }
    });

    return await modal.present();
  }

  async showLoading() {
    const loading = await this.loadingCtrl.create({
      message: 'Espere un momento...',
      spinner: 'crescent'
    });
  
    await loading.present();
  }

  

  saveBill() {
    if(this.frm.invalid || !this.firebaseAuth.currentUser?.uid) return;
    this.dataHandler.isLoading = true;
    this.showLoading();
    
    let { billing_date_from, billing_date_to, ...remainingValues } = this.frm.value;
    billing_date_from = format(parseISO(billing_date_from), 'yyyy-MM-dd'); //2024-12-01
    billing_date_to = format(parseISO(billing_date_from), 'yyyy-MM-dd'); //2024-12-01
    const bill = { billing_date_from, billing_date_to, ...remainingValues };

    const doc = {
      ...bill as Bill,
      uid: this.firebaseAuth.currentUser.uid
    };

    this.firestore.insertDataIfNotExists<Bill>({
      collectionPath: 'bills',
      data: doc,
      conditions: [
        {
          field: 'client_code',
          operator: '==',
          value: doc.client_code
        },
        {
          field: 'type_consumption',
          operator: '==',
          value: doc.type_consumption
        },
        {
          field: 'billing_date.from',
          operator: '==',
          value: doc.billing_date_from
        },
        {
          field: 'billing_date.to',
          operator: '==',
          value: doc.billing_date_to
        }
      ]
    })
    .then(async (docInsertedInfo) => {
      console.log('Bill insertado add-bill.comp', docInsertedInfo);
      
      await this.firestore.insertDataIfNotExists<EnergyHistoryByMonth>({
        collectionPath: 'energy_history_by_month',
        data:  {
          uid: doc.uid,
          kwh: (doc.kwh as unknown as number) / 2,
          date: doc.billing_date_from as string,
          bill_id: docInsertedInfo['id']
        },
        conditions: [
          {
            field: 'date',
            operator: '==',
            value: doc.billing_date_from as string
          },
          {
            field: 'uid',
            operator: '==',
            value: doc.uid
          }
        ]
      });

      await this.firestore.insertDataIfNotExists<EnergyHistoryByMonth>({
        collectionPath: 'energy_history_by_month',
        data:  {
          uid: doc.uid,
          kwh: (doc.kwh as unknown as number) / 2,
          date: doc.billing_date_to as string,
          bill_id: docInsertedInfo['id']
        },
        conditions: [
          {
            field: 'date',
            operator: '==',
            value: doc.billing_date_to as string
          },
          {
            field: 'uid',
            operator: '==',
            value: doc.uid
          }
        ]
      });

      this.dataHandler.isObtained = true;

      this.toastCtrl.create({
        message: '<ion-icon name="checkmark-circle" /> Factura guardada',
        duration: 3000
      });

      this.modalCtrl.dismiss({ refresh: true });
      this.loadingCtrl.dismiss();

      /**
       * Limpiar el caché del historial, ya que hay un nuevo registro
       */
      localStorage.removeItem('energy_history_by_month');
    })
    .catch(error => {
      this.dataHandler.error = {
        msg: error.message
      };
      console.error('Error al insertar documento: ', error);
    })
    .finally(() => {
      this.dataHandler.isFinished = false;
      this.dataHandler.isLoading = false;
    });
  }
  
  ngOnInit(): void {
    this.currentdate = this.formatDateWithLeadingZero();
  }

  formatDateWithLeadingZero() {
    const date = new Date();
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    
    return `${year}-${month}-${day}`;
  }
}
