import { Component } from '@angular/core';
import { MapService, PlacesService } from '../../services';

@Component({
  selector: 'app-btn-my-location',
  standalone: false,

  templateUrl: './btn-my-location.component.html',
  styleUrl: './btn-my-location.component.css'
})
export class BtnMyLocationComponent {

  constructor(
    private mapService: MapService,
    private placesService: PlacesService
  ) { }

  public goToMyLocation(){

    if(!this.placesService.isUserLocationReady) throw Error('User location not ready');
    if(!this.mapService.isMapReady) throw Error('There is no map');

    this.mapService.flyTo(this.placesService.userLocation!)
  }
}
