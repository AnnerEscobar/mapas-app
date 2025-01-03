import { Component } from '@angular/core';
import { MapService, PlacesService } from '../../services';
import { Feature } from '../../interfaces/lases';

@Component({
  selector: 'app-search-results',
  standalone: false,

  templateUrl: './search-results.component.html',
  styleUrl: './search-results.component.css'
})
export class SearchResultsComponent {

  public selectedId = '';

  constructor(
    private placesService: PlacesService,
    private mapService: MapService

  ) { }

  get isLoadingPlaces() {
    return this.placesService.isLoadingPlaces;
  }

  get places(){
    return this.placesService.places;
  }

  flyTo(place: Feature){
    this.selectedId = place.id;
    const [lng, lat] = place.center;
    this.mapService.flyTo([lng, lat]);
  }

}
