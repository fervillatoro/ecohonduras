import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonCard, IonCardTitle, IonCardHeader, IonCardContent, IonIcon, IonButton, IonFooter, IonCardSubtitle, IonSegment, IonSegmentButton, IonLabel, IonText, IonList, IonItem, IonSkeletonText } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { statsChart } from 'ionicons/icons';
import { API } from 'src/app/interfaces/api';
import { EChartsOption } from 'echarts';
import { NgxEchartsDirective, provideEcharts } from 'ngx-echarts';
import { EnergyHistoryByMonth } from 'src/app/interfaces/energy_history_by_month';
import { FirestoreService } from 'src/app/services/firebase/firestore.service';
import { Auth } from '@angular/fire/auth';

type Range = 'bajo' | 'moderado' | 'alto' | 'muy_alto';
interface RangeValue { icon: string; color: string; value: number; range: Range; };

/**
 * @interface CarbonFootprintData
 * @var kwhAnnual Consumo anual de electricidad en kWh
 * @var kwhMonthly Consumo mensual de electricidad en kWh
 * @var co2PerKwh Factor de emisión de CO2 por kWh en la región del usuario en  HN
 * @var co2Monthly Cantidad de CO2 en kg que el usuario genera mensualmente
 * @var co2MonthlyRounded Cantidad de CO2 redondeada a 2 decimales
 * @var co2Annual Cantidad de CO2 en kg que el usuario genera anualmente
 * @var co2AnnualRounded Cantidad de CO2 redondeada a 2 decimales
 */
interface CarbonFootprintData {
  kwhAnnual: RangeValue,
  kwhMonthly: RangeValue;
  co2PerKwh: number;
  co2Monthly: RangeValue;
  co2Annual: RangeValue;
  co2MonthlyRounded: RangeValue;
  co2AnnualRounded: RangeValue;
}

@Component({
  selector: 'app-carbon-footprint',
  templateUrl: './carbon-footprint.page.html',
  styleUrls: ['./carbon-footprint.page.scss'],
  standalone: true,
  imports: [IonSkeletonText, IonItem, IonList, IonText, IonLabel, IonSegmentButton, IonSegment, IonCardSubtitle, IonFooter, 
    IonButton, IonIcon, IonCardContent, IonCardHeader,
    IonCardTitle, IonCard, IonContent, IonHeader,
    IonTitle, IonToolbar, CommonModule, FormsModule,
    NgxEchartsDirective
  ],
  providers: [provideEcharts()]
})
export class CarbonFootprintPage implements OnInit {
  segmentValue = 'current';
  dataHandler: API.DataHandler<CarbonFootprintData> = {
    isLoading: true,
    isFinished: false,
    isObtained: false,
    data: null
  };
  

  constructor(private firestore: FirestoreService, private authFirebase: Auth) {
    addIcons({
      'co2': '/assets/md-icons/co2_24dp_E8EAED_FILL1_wght400_GRAD0_opsz24.svg',
      'foot': '/assets/md-icons/barefoot_24dp_E8EAED_FILL1_wght400_GRAD0_opsz24.svg',
      statsChart
    })
  }


  /**
   * Calcular la huella de carbono del usuario
   * Según su consumo mensual de electricidad
   * @var kwhMonthly Consumo mensual de electricidad en kWh
   * @var co2PerKwh Factor de emisión de CO2 por kWh en la región del usuario en  HN
   * @var co2Monthly Cantidad de CO2 en kg que el usuario genera mensualmente
   * @var co2MonthlyRounded Cantidad de CO2 redondeada a 2 decimales
   * @var co2Annual Cantidad de CO2 en kg que el usuario genera anualmente
   * @var co2AnnualRounded Cantidad de CO2 redondeada a 2 decimales
   * 
   * @returns La cantidad de CO2 en kg que el usuario genera mensualmente
   * 
   * Factor de emisión de CO2 en Honduras aproximado
   * @see https://united4efficiency.org/wp-content/uploads/2019/11/ES_HND_U4E-Country-Saving-Assessment_All.pdf
   */
  async calculate() {
    this.dataHandler.error = undefined;
    
    const getRange = (kwh: number, monthlyOrAnnual: 'monthly' | 'annual'): { icon: string, color: string, range: Range } => {
      switch(monthlyOrAnnual) {
        case 'monthly':
          if(kwh <= 25) return { icon: 'foot', color: 'success', range: 'bajo' };
          if(kwh <= 50) return { icon: 'foot', color: 'medium', range: 'moderado' };
          if(kwh <= 100) return { icon: 'foot', color: 'warning', range: 'alto' };
        return { icon: 'foot', color: 'danger', range: 'muy_alto' };
        
        case 'annual':
          if(kwh <= 300) return { icon: 'co2', color: 'success', range: 'bajo' };
          if(kwh <= 600) return { icon: 'co2', color: 'medium', range: 'moderado' };
          if(kwh <= 1200) return { icon: 'co2', color: 'warning', range: 'alto' };
        return { icon: 'co2', color: 'danger', range: 'muy_alto' };
      };
    }
    

    if(!this.authFirebase.currentUser?.uid) return;

    const history: EnergyHistoryByMonth[] = await this.firestore.getAllData<EnergyHistoryByMonth>({
      collection: 'energy_history_by_month',
      where: ['uid', '==', this.authFirebase.currentUser.uid],
      cache: { 'd': 1 }
    });

    if(history.length === 0) {
      this.dataHandler.isLoading = false;
      this.dataHandler.error = {
        msg: 'No hay historial de consumo, primero agrega una factura desde la página de consumo.',
      }
      return;
    }

    const kwhAnnual  = history.reduce((acc, h) => acc + h.kwh, 0);
    const kwhMonthly = +(kwhAnnual / 12).toFixed(2);
    const co2PerKwh  = 0.65;
    const co2Monthly = +((kwhMonthly * co2PerKwh)).toFixed(2);
    const co2Annual  = +(co2Monthly * 12).toFixed (2);
    const co2MonthlyRounded = +(Math.round(+co2Monthly * 100) / 100).toFixed (2);
    const co2AnnualRounded = +(Math.round(+co2Annual * 100) / 100).toFixed (2);
    
    this.dataHandler.data = {
      kwhAnnual:         {...getRange(kwhAnnual, 'annual'), value: kwhAnnual},
      kwhMonthly:        {...getRange(kwhMonthly, 'monthly'), value: kwhMonthly},
      co2PerKwh:         co2PerKwh,
      co2Annual:         {...getRange(co2Annual, 'annual'), value: co2Annual},
      co2Monthly:        {...getRange(co2Monthly, 'monthly'), value: co2Monthly},
      co2MonthlyRounded: {...getRange(co2MonthlyRounded, 'monthly'), value: co2MonthlyRounded},
      co2AnnualRounded:  {...getRange(co2AnnualRounded, 'annual'), value: co2AnnualRounded}
    };

    this.initChart();
    this.dataHandler.isObtained = true;

    console.log(`The user generates approximately ${co2MonthlyRounded} kg of CO2 per month.`);
    console.log(`The user generates approximately ${co2AnnualRounded} kg of CO2 per year.`);
  }

  // ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
  chartOptions!: EChartsOption;

  chartOptionsInitOptions: EChartsOption = {
    renderer: 'svg',
    backgroundColor: 'transparent',
    series: [
      {
        type: 'gauge',
        startAngle: 180,
        endAngle: 0,
        center: ['50%', '75%'],
        radius: '90%',
        min: 0,
        max: 200,
        splitNumber: 8,
        axisLine: {
          lineStyle: {
            width: 6,
            color: [
              [0.25, '#7CFFB2'],
              [0.5, '#58D9F9'],
              [0.75, '#FDDD60'],
              [1, '#FF6E76']
            ]
          }
        },
        pointer: {
          icon: 'path://M12.8,0.7l12,40.1H0.7L12.8,0.7z',
          length: '12%',
          width: 20,
          offsetCenter: [0, '-60%'],
          itemStyle: {
            color: 'auto'
          }
        },
        axisTick: {
          length: 12,
          lineStyle: {
            color: 'auto',
            width: 2
          }
        },
        splitLine: {
          length: 20,
          lineStyle: {
            color: 'auto',
            width: 2
          }
        },
        axisLabel: {
          color: '#464646',
          fontSize: 20,
          distance: -60,
          rotate: 'tangential',
          formatter: function (value) {
            return '';
            // if (value === 0.125) {
            //   return 'Bajo';
            // } else if (value === 0.375) {
            //   return 'Moderado';
            // } else if (value === 0.625) {
            //   return 'Alto';
            // } else if (value === 0.875) {
            //   return 'Muy alto';
            // }
            // return '';
          }
        },
        title: {
          offsetCenter: [0, '-10%'],
          fontSize: 20
        },
        detail: {
          fontSize: 30,
          offsetCenter: [0, '-35%'],
          valueAnimation: true,
          // formatter: function (value) {
          //   return Math.round(value * 100) + '';
          // },
          color: 'inherit'
        },
        // data: [
        //   {
        //     value: 0.7,
        //     name: 'Alto'
        //   }
        // ]
      }
    ]
  };

  initChart() {
    const chartOptions: any = this.chartOptionsInitOptions;
    if(chartOptions.series && (chartOptions.series as Array<unknown>).length > 0) {
      chartOptions.series[0].data = [
        {
          value: this.dataHandler.data?.co2MonthlyRounded.value,
          name: "kg CO2/mes"
        }
      ];
    }

    this.chartOptions = chartOptions;
    this.dataHandler.isLoading = false;
    this.dataHandler.isFinished = true;
  }

  ngOnInit() {
    this.calculate();
  }

}
