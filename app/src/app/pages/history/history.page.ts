import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonButton, IonIcon, IonCard, IonCardTitle, IonCardContent, IonCardHeader, IonCardSubtitle, IonModal, IonItem, ModalController, IonSkeletonText } from '@ionic/angular/standalone';

import { NgxEchartsDirective, provideEcharts } from 'ngx-echarts';
// import { EChartsOption } from 'echarts';
import { addIcons } from 'ionicons';
import { addOutline } from 'ionicons/icons';
import { FirestoreService } from 'src/app/services/firebase/firestore.service';
import { Bill } from 'src/app/interfaces/bill';
import { API } from 'src/app/interfaces/api';
import { Auth } from '@angular/fire/auth';
import { EnergyHistoryByMonth } from 'src/app/interfaces/energy_history_by_month';
import { AddBillPage } from './add-bill/add-bill.page';
import { ECharts, EChartsInitOpts, EChartsOption } from 'echarts';


@Component({
  selector: 'app-history',
  templateUrl: './history.page.html',
  styleUrls: ['./history.page.scss'],
  standalone: true,
  imports: [IonSkeletonText, 
    IonItem, IonModal, IonIcon, IonContent, IonHeader, IonTitle,
    IonButtons, IonButton, IonCard, IonCardTitle, IonCardSubtitle,
    IonCardContent, IonCardHeader, IonToolbar, CommonModule, FormsModule,
    NgxEchartsDirective
  ],
  providers: [
    ModalController,
    provideEcharts()
  ]
})
export class HistoryPage implements OnInit {

  @ViewChild('chartContainer', { static: true }) chartContainer!: ElementRef;


  // ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
  chartOptionsWithAPIData!: EChartsOption;
  

  chartOptionsInitial: EChartsOption = {
    backgroundColor: 'transparent', // Color de fondo del gráfico
    tooltip: {
      trigger: 'axis'
    },
    renderer: 'svg',
    // legend: {
    //   data: []
    // },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    toolbox: {
      feature: {
        saveAsImage: {
          title: 'Guardar como imagen'
        }
      }
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'],
      axisLabel: {
        rotate: 50 // Gira las etiquetas 90 grados para que se muestren verticalmente
      }
    },
    yAxis: {
      type: 'value'
    },
    series: [
      // {
      //   name: '2022',
      //   type: 'line',
      //   stack: 'Total',
      //   data: [5, 6, 8, 7, 4, 9, 11]
      // },
      // {
      //   name: '2023',
      //   type: 'line',
      //   stack: 'Total',
      //   data: [8, 9, 10, 11, 5, 7, 3]
      // },
      // {
      //   name: '2024',
      //   type: 'line',
      //   stack: 'Total',
      //   data: [1, 2, 3, 4, 5, 6, 7]
      // }
    ]
  };

  dataHandler: API.DataHandler<Bill[]> = {
    isLoading: true,
    isFinished: false,
    isObtained: false,
    data: null
  };

  constructor(private firestore: FirestoreService, private authFirebase: Auth, private modalCtrl: ModalController) {
    addIcons({
      addOutline
    });
  }

  initCharts() {
    if(!this.authFirebase.currentUser?.uid) {
      console.error('No hay usuario autenticado');
      return;
    }

    this.dataHandler.isLoading = true;

    const history: Promise<EnergyHistoryByMonth[]> = this.firestore.getAllData<EnergyHistoryByMonth>({
      collection: 'energy_history_by_month',
      where: ['uid', '==', this.authFirebase.currentUser.uid],
      cache: { 'd': 1 }
    });

    history.then((energyHistory: EnergyHistoryByMonth[]) => {
      const years: string[] = [];
      const series: any[] = [];

      for (const h of energyHistory) {

        /**
         * @description Cada serie representa un año
         */
        const dateSplit = h.date.split('-');
        const year = dateSplit[0];
        const month =+ dateSplit[1] - 1;
        const day = dateSplit[2];

        if (!years.includes(year)) years.push(year);

        const serieIndex = series.findIndex((s: any) => s.name === year);
        const thisSerieAlreadyExists = serieIndex > -1;

        /**
         * @description Si la serie ya existe, se verifica si el mes ya existe
         * 
         */
        const kwhPrevMonth = series[serieIndex]?.data[month] ? series[serieIndex]?.data[month] : 0;

        if(!thisSerieAlreadyExists) {
          let data = [];
          data[month] = h.kwh + kwhPrevMonth;

          series.push({
            name: year,
            type: 'line',
            stack: 'Total',
            data
          });
        } else {
          series[serieIndex].data[month] = h.kwh + kwhPrevMonth;
        }


      }
      
      this.chartOptionsWithAPIData = {
        legend: { data: years },
        series
      };

      
      console.log('Energy History Monitoring', energyHistory);
    })
    .finally(() => {
      this.dataHandler.isFinished = true;
      this.dataHandler.isObtained = true;
      this.dataHandler.isLoading = false;
    });
    
  }

  async addBillModal() {
    const modal = await this.modalCtrl.create({
      component: AddBillPage,
      // cssClass: 'my-custom-class', // Opcional, para personalizar estilos
    });

    modal.onDidDismiss().then((result) => {
      console.log('modal.onDidDismiss', result);
      
      if(result.data.refresh) {
        this.initCharts();
      }
    });
    return await modal.present();
  }

  ngOnInit() {
  }
  
  ionViewDidEnter() {
    this.initCharts();
  }


}
