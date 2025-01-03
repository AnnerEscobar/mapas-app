import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Feature, PlacesResponse } from '../interfaces/lases';
import { PlacesAlpiClient } from '../api/placesAlpiClient';

@Injectable({
  providedIn: 'root'
})
export class PlacesService {

  public userLocation?: [number, number];

  public isLoadingPlaces = false;
  public places: Feature[] = [];

  get isUserLocationReady(): boolean {
    return !!this.userLocation;
  }

  constructor(private placesApi: PlacesAlpiClient) {
    this.getUserLocation();
  }


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

  getPlacesByQuery(query: string = '') {

    if(!this.userLocation) throw new Error('No se ha obtenido la ubicación del usuario');
    this.isLoadingPlaces = true;

    this.placesApi.get<PlacesResponse>(`${query}`, {
      params: {
        proximity: this.userLocation.join(','),
      }
    })
    .subscribe(resp =>{
      this.isLoadingPlaces = false;
      this.places = resp.features;
    })
  }
}
