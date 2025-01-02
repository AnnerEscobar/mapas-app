import { AfterViewInit, Component, ElementRef, ViewChild, viewChild } from '@angular/core';
import { Map, Popup, Marker } from 'mapbox-gl';
import { MapService } from '../../services/maps.service';
import { PlacesService } from '../../services/places.service';


@Component({
  selector: 'app-map-view',
  standalone: false,

  templateUrl: './map-view.component.html',
  styleUrl: './map-view.component.css'
})
export class MapViewComponent implements AfterViewInit {

  @ViewChild('mapDiv')
  mapDivElement!: ElementRef;

  constructor(
    private placesService: PlacesService,
    private mapService: MapService
  ) { }

  ngAfterViewInit(): void {

    if (!this.placesService.userLocation) throw Error('No se ha encontrado la ubicación del usuario');

    const map = new Map({
      container: this.mapDivElement.nativeElement, // container ID
      style: 'mapbox://styles/mapbox/streets-v12', // style URL
      center: this.placesService.userLocation, // starting position [lng, lat]
      zoom: 14, // starting zoom
    });


    const popup = new Popup()
      .setHTML(`
    <h6>Aqui estoy</h6>
    <span>Im in this part of the word</span>
    `);

    new Marker({ color: 'red' })
      .setLngLat(this.placesService.userLocation)
      .setPopup(popup)
      .addTo(map);

      this.mapService.setMap(map);
  }


}
