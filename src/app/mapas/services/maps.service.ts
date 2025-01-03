import { DirectionsApiClient } from './../api/directionsApiClient';
import { Injectable } from '@angular/core';
import { AnySourceData, LngLatBounds, LngLatLike, Map, Marker, Popup, SourceSpecification } from 'mapbox-gl';
import { Feature } from '../interfaces/lases';
import { notEqual } from 'assert';
import { DirectionsResponse, Route } from '../interfaces/directions';

@Injectable({
  providedIn: 'root'
})
export class MapService {

  private map?: Map;
  private markers: Marker[] = [];

  get isMapReady(): boolean {
    return !!this.map;
  }

  constructor(private directionsApi: DirectionsApiClient) {

  }

  setMap(map: Map) {
    this.map = map;
  }

  flyTo(coords: LngLatLike) {
    if (!this.isMapReady) throw new Error('Map is not ready');
    this.map?.flyTo({
      center: coords,
      zoom: 15
    });
  }

  createMarkerFromPlaces(places: Feature[], userLocation: [number, number]) {
    if (!this.map) throw new Error('Map is not ready');
    this.markers.forEach(marker => marker.remove());
    const newMarkers = [];

    for (const place of places) {
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
    if (places.length === 0) return;

    //limites del mapa

    const bounds = new LngLatBounds();
    newMarkers.forEach(marker => bounds.extend(marker.getLngLat()));
    bounds.extend(userLocation);

    this.map?.fitBounds(bounds, {
      padding: 100
    });
  }

  getRouteBetweenPoints(start: [number, number], end: [number, number]) {
    this.directionsApi.get<DirectionsResponse>(`/${start.join(',')}; ${end.join(',')}`)
      .subscribe(resp => this.drawPolyline(resp.routes[0]));
  }


  private drawPolyline(route: Route) {
    console.log({ Kms: route.distance / 1000, duration: route.duration / 60 });

    if (!this.map) throw Error('Map is not ready');

    const coords = route.geometry.coordinates;

    const bounds = new LngLatBounds();
    coords.forEach(([lng, lat]) => {
      bounds.extend([lng, lat]);
    });

    this.map?.fitBounds(bounds, {
      padding: 200
    })


    const sourceData: SourceSpecification = {

      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features:[
          {
            type: 'Feature',
            properties: {},
            geometry:{
              type: 'LineString',
              coordinates: coords,
            }
          }
        ]
      }
    }

    //TODO: limpiar la ruta previa

    if(this.map.getLayer('RouteString')){
      this.map.removeLayer('RouteString');
      this.map.removeSource('RouteString');
    }

    this.map.addSource('RouteString', sourceData);
    this.map.addLayer({
      id: 'RouteString',
      type: 'line',
      source: 'RouteString',
      layout: {
        'line-join': 'round',
        'line-cap': 'round'
      },
      paint: {
        'line-color': '#3887be',
        'line-width': 5
      }
    })

  }



}


