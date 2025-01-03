import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Feature, PlacesResponse } from '../interfaces/lases';
import { PlacesAlpiClient } from '../api/placesAlpiClient';
import { MapService } from './maps.service';

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

  constructor(private placesApi: PlacesAlpiClient, private mapService: MapService) {
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

    if(query.length === 0){
      this.isLoadingPlaces = false;
      this.places = [];
      return;
    }

    if(!this.userLocation) throw new Error('No se ha obtenido la ubicación del usuario');
    this.isLoadingPlaces = true;

    this.placesApi.get<PlacesResponse>(`/${query}.json`, {
      params: {
        proximity: this.userLocation.join(','),
      }
    })
    .subscribe(resp =>{
      this.isLoadingPlaces = false;
      this.places = resp.features;
      this.mapService.createMarkerFromPlaces(this.places);
    })
  }
}
