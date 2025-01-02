import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PlacesService {

  public userLocation?: [number, number];

  get isUserLocationReady(): boolean {
    return !!this.userLocation;
  }

  constructor() {}

  /**
   * Obtiene la ubicación del usuario utilizando la API de Geolocalización del navegador.
   * @returns Una promesa que resuelve con las coordenadas [latitude, longitude].
   */
  public async getUserLocation(): Promise<[number, number]> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        alert('Geolocalización no soportada en este navegador.');
        reject('Geolocalización no soportada.');
        return;
      }

      navigator.geolocation.getCurrentPosition(
        ({ coords }) => {
          console.log('Coordenadas obtenidas:', coords);
          this.userLocation = [coords.longitude, coords.latitude]; // Cambiado el orden a [latitude, longitude]
          resolve(this.userLocation);
        },
        (err) => {
          console.error('Error al obtener la ubicación:', err);
          alert('No se pudo obtener la ubicación del usuario.');
          reject(err);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    });
  }
}
