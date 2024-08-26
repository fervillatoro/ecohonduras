import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonThumbnail, IonRow, IonCol, IonCard, IonCardTitle, IonCardContent, IonButton, IonCardHeader, IonList, IonItem, IonCardSubtitle, IonLabel, IonText, IonAvatar, IonIcon, IonAccordion, IonAccordionGroup, IonButtons } from '@ionic/angular/standalone';
import { RouterLink } from '@angular/router';
import { addIcons } from 'ionicons';
import { grid, shirt, sunny, thermometerOutline } from 'ionicons/icons';
import { API } from 'src/app/interfaces/api';
import { CacheService } from 'src/app/services/cache.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [IonButtons, IonAccordionGroup, IonAccordion, 
    IonIcon, IonAvatar, IonText, IonLabel, IonCardSubtitle, IonItem, IonList, IonCardHeader, 
    IonRow, IonCol, IonContent, IonHeader, IonTitle, IonToolbar,
    IonCard, IonCardTitle, IonCardContent, IonButton, CommonModule,
    FormsModule, RouterLink, IonThumbnail
  ]
})
export class HomePage implements OnInit {
  dataHandlerWeather: API.DataHandler<any> = {
    isLoading: false,
    isFinished: false,
    isObtained: false,
    data: null
  };

  // {
  //   "location": {
  //     "name": "Council Bluffs",
  //     "region": "Iowa",
  //     "country": "United States of America",
  //     "lat": 41.26,
  //     "lon": -95.86,
  //     "tz_id": "America/Chicago",
  //     "localtime_epoch": 1724450758,
  //     "localtime": "2024-08-23 17:05"
  //   },
  //   "current": {
  //       "last_updated_epoch": 1724450400,
  //       "last_updated": "2024-08-23 17:00",
  //       "temp_c": 25.3,
  //       "temp_f": 77.5,
  //       "is_day": 1,
  //       "condition": {
  //           "text": "Partly cloudy",
  //           "icon": "//cdn.weatherapi.com/weather/64x64/day/116.png",
  //           "code": 1003
  //       },
  //       "wind_mph": 10.5,
  //       "wind_kph": 16.9,
  //       "wind_degree": 150,
  //       "wind_dir": "SSE",
  //       "pressure_mb": 1018.0,
  //       "pressure_in": 30.07,
  //       "precip_mm": 0.0,
  //       "precip_in": 0.0,
  //       "humidity": 64,
  //       "cloud": 75,
  //       "feelslike_c": 25.5,
  //       "feelslike_f": 78.0,
  //       "windchill_c": 27.0,
  //       "windchill_f": 80.6,
  //       "heatindex_c": 27.2,
  //       "heatindex_f": 81.0,
  //       "dewpoint_c": 13.0,
  //       "dewpoint_f": 55.4,
  //       "vis_km": 16.0,
  //       "vis_miles": 9.0,
  //       "uv": 7.0,
  //       "gust_mph": 13.4,
  //       "gust_kph": 21.5
  //     }
  //   };
  constructor(private cacheService: CacheService) {
    addIcons({
      thermometerOutline,
      grid,
      sunny,
      shirt,
      'cofeemaker': '/assets/md-icons/coffee_maker_24dp_E8EAED_FILL1_wght400_GRAD0_opsz24.svg',
      'curtains': '/assets/md-icons/curtains_24dp_E8EAED_FILL1_wght400_GRAD0_opsz24.svg',
      'skillet': '/assets/md-icons/skillet_cooktop_24dp_E8EAED_FILL1_wght400_GRAD0_opsz24.svg',
      'fan': '/assets/md-icons/mode_fan_24dp_E8EAED_FILL1_wght400_GRAD0_opsz24.svg',
      'iron': '/assets/md-icons/iron_24dp_E8EAED_FILL1_wght400_GRAD0_opsz24.svg',
      'lightbulb': '/assets/md-icons/lightbulb_24dp_E8EAED_FILL1_wght400_GRAD0_opsz24.svg',
    });
  }

  energySavingTips: { icon: string, text: string }[] = [];
  temperatureInLetters!: string;

  generateTips() {
    const temperature = this.dataHandlerWeather.data.current.temp_c;

    if (temperature > 11 && temperature < 19) {
      this.temperatureInLetters = 'frío';
      this.energySavingTips = [
        { icon: 'thermometer-outline', text: 'Pon tu aire entre 18°C - 20°C.' },
        { icon: 'grid', text: 'Asegúrate de que las ventanas y puertas estén bien selladas.' },
        { icon: 'shirt', text: 'Vístete con ropa abrigada en lugar de aumentar la calefacción.' }
      ];
    } else if (temperature > 18 && temperature < 25) {
      this.temperatureInLetters = 'templado';
      this.energySavingTips = [
        { icon: 'grid', text: 'Abre ventanas durante las horas más frescas del día.' },
        { icon: 'sunny', text: 'Aprovecha al máximo la luz natural y apaga las luces cuando no sean necesarias.' },
        { icon: 'cofeemaker', text: 'Usa electrodomésticos eficientes y evita el uso innecesario de aparatos que generen calor.' },
        { icon: 'curtains', text: 'Mantén las cortinas abiertas durante el día y ciérralas por la noche para retener el calor.' }
      ];
    } else if (temperature > 24 && temperature < 31) {
      this.temperatureInLetters = 'cálido';
      this.energySavingTips = [
        { icon: 'thermometer-outline', text: 'Mantén la temperatura del aire acondicionado entre 24°C y 26°C.' },
        { icon: 'curtains', text: 'Instala persianas, cortinas gruesas o toldos para bloquear la luz solar directa.' },
        { icon: 'skillet', text: 'Cocina al aire libre si es posible para reducir la carga térmica en el interior de la casa.' },
        { icon: 'fan', text: 'Ventila la casa por la noche cuando la temperatura es más fresca.' }
      ];
    } else if (temperature > 30 && temperature < 46) {
      this.temperatureInLetters = 'muy caliente';
      this.energySavingTips = [
        { icon: 'thermometer-outline', text: 'Mantén la temperatura del aire acondicionado en 26°C o más.' },
        { icon: 'iron', text: 'Evita usar aparatos que generen calor durante el día.' },
        { icon: 'lightbulb', text: 'Usa bombillas LED que generan menos calor y son más eficientes energéticamente.' }
      ];
    } else {
      this.temperatureInLetters = 'Clima fuera de rango';
      this.energySavingTips = [{ icon: '', text: 'Temperatura fuera de rango.' }];
    }
  }

  async getIp(): Promise<string> {
    const ip = this.cacheService.getCachedData<string>('ip');
    if(ip) return new Promise<string>(resolve => resolve(ip));
    
    const response = await fetch('https://api.ipify.org?format=json');
    const data     = await response.json();
    const ipAPI = data.ip;
    this.cacheService.setCachedData('ip', ipAPI, {'d': 1});
    return ipAPI;
  }

  async getWeather() {
    const ip = await this.getIp();
    if(!ip) {
      console.error('No se pudo obtener la dirección IP.');
      return;
    }

    const weatherCachedData = this.cacheService.getCachedData<unknown>('weather');
    console.log(weatherCachedData);
    

    if(weatherCachedData) {
      this.dataHandlerWeather.data = weatherCachedData;
      this.generateTips();
      this.dataHandlerWeather.isObtained = true;
      return;
    }

    this.dataHandlerWeather.isLoading = true;
    fetch(`https://api.weatherapi.com/v1/current.json?key=93b8a700cd154317a5e211547242308&q=${ip}&aqi=no`)
      .then(response => response.json())
      .then(data => {
        this.dataHandlerWeather.data = data;
        this.cacheService.setCachedData('weather', data, {'h': 2});
        this.generateTips();
        this.dataHandlerWeather.isObtained = true;
      })
      .catch(error => {
        this.dataHandlerWeather.error = {
          msg: error.message
        };
        console.error('Error al obtener datos: ', error);
      })
      .finally(() => {
        this.dataHandlerWeather.isFinished = false;
        this.dataHandlerWeather.isLoading = false;
      });
  }

  ngOnInit() {
    this.getWeather();
  }

}
