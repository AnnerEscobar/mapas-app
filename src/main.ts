import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';
import mapboxgl from 'mapbox-gl';

if(!navigator.geolocation){
  console.log('error desde el main')
  throw new Error('Navegador no soprota la geolocalización');

}

mapboxgl.accessToken = 'pk.eyJ1IjoiYW5uZXJyZWMiLCJhIjoiY201ZnNhNTZpMDB2NTJqcHI3MW1sbTl6ciJ9.anP9JFeZPbP2x6evmgGS4w';


platformBrowserDynamic().bootstrapModule(AppModule, {
  ngZoneEventCoalescing: true,
})
  .catch(err => console.error(err));
