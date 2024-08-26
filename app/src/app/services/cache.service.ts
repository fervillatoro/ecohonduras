import { Injectable } from '@angular/core';
import { CacheDuration } from '../interfaces/cache';

@Injectable({
  providedIn: 'root'
})
export class CacheService {

  constructor() { }

  clear() {
    localStorage.clear();
  }

  setCachedData<T>(key: string, data: T, duration: CacheDuration): void {
    const expirationDate: string = this.generateDateExpired(duration);
    const cache = {
      data,
      due_date: expirationDate
    };

    console.log('Set Cache:', cache);
    
    localStorage.setItem(key, JSON.stringify(cache));
  }

  getCachedData<T>(key: string): T | null {
    const cached = localStorage.getItem(key);
    console.log('Getting Cache...', cached);
    
    if (cached) {
      console.log('Get Cache:', cached);
      const { data, due_date } = JSON.parse(cached);
      if (!this.isDateExpired(due_date)) { 
        return data;
      } else {
        localStorage.removeItem(key); // Limpiar datos expirados
      }
    }
    return null;
  }

  parseDuration(cacheDuration: CacheDuration): { days: number, hours: number, months: number, years: number } {
    return {
      days: cacheDuration.d ?? 0,
      hours: cacheDuration.h ?? 0,
      months: cacheDuration.m ?? 0,
      years: cacheDuration.y ?? 0
    };
  }

  isDateExpired(dueDate: string): boolean {
    const addZero = (num: number) => num < 10 ? `0${num}` : num;
    const d = new Date();
    const currentDate = `${d.getFullYear()}-${addZero(d.getMonth() + 1)}-${d.getDate()} ${addZero(d.getHours())}:${addZero(d.getMinutes())}:${addZero(d.getSeconds())}`;

    const isExpired = new Date(dueDate).getTime() < new Date(currentDate).getTime();
    return isExpired;
  }


  generateDateExpired(duration: CacheDuration): string {
    const parsedDuration = this.parseDuration(duration);
    const now = new Date();

    // Añadir años
    const futureDate = new Date(now.setFullYear(now.getFullYear() + parsedDuration.years));

    // Añadir meses
    futureDate.setMonth(futureDate.getMonth() + parsedDuration.months);

    // Añadir días
    futureDate.setDate(futureDate.getDate() + parsedDuration.days);

    // Añadir horas
    futureDate.setHours(futureDate.getHours() + parsedDuration.hours);

    // Formatear la fecha
    const year = futureDate.getFullYear();
    const month = String(futureDate.getMonth() + 1).padStart(2, '0'); // Meses empiezan en 0
    const day = String(futureDate.getDate()).padStart(2, '0');
    const hour = String(futureDate.getHours()).padStart(2, '0');
    const minute = String(futureDate.getMinutes()).padStart(2, '0'); // Minutos del sistema
    const second = String(futureDate.getSeconds()).padStart(2, '0'); // Segundos del sistema

    return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
  }
}
