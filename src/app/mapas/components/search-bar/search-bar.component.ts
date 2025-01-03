import { PlacesService } from './../../services/places.service';
import { Component } from '@angular/core';

@Component({
  selector: 'app-search-bar',
  standalone: false,

  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.css'
})
export class SearchBarComponent {

  private debounceTimer?: NodeJS.Timeout;


  constructor(
    private placesService: PlacesService
  ) { }

  onQueryChange(query: string = '') {

    if (this.debounceTimer) clearTimeout(this.debounceTimer);

    this.debounceTimer = setTimeout(() => {
      this.placesService.getPlacesByQuery(query);
    }, 350);

  }

}
