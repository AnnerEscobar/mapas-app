import { Injectable } from '@angular/core';
import { LngLatBounds, LngLatLike, Map, Marker, Popup } from 'mapbox-gl';
import { Feature } from '../interfaces/lases';
import { notEqual } from 'assert';

@Injectable({
  providedIn: 'root'
})
export class MapService {

  private map?: Map;
  private markers: Marker [] = [];

  get isMapReady(): boolean {
    return !!this.map;
  }

  setMap(map: Map) {
    this.map = map;
  }

  flyTo(coords: LngLatLike) {
    if(!this.isMapReady) throw new Error('Map is not ready');
    this.map?.flyTo({
      center: coords,
      zoom: 15
    });
  }

  createMarkerFromPlaces(places: Feature[]){
    if(!this.map) throw new Error('Map is not ready');
    this.markers.forEach(marker => marker.remove());
    const newMarkers = [];

    for(const place of places){
    const [lng, lat] = place.center;
    const popup = new Popup()
    .setHTML(`
      <6>${place.text}</h6>\
      <span>${place.place_name}</span>
      `);
      const newMarker = new Marker()
      .setLngLat([lng, lat])
      .setPopup(popup)
      .addTo(this.map);

      newMarkers.push(newMarker);
    }
    this.markers = newMarkers;
    if(places.length === 0) return;

    //limites del mapa

    const bounds = new LngLatBounds();

    newMarkers.forEach(marker => bounds.extend(marker.getLngLat()));

    this.map?.fitBounds(bounds, {
      padding: 100
    });
  }



}


