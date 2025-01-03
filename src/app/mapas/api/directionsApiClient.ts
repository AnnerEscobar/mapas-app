import { HttpClient, HttpHandler, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment.prod";

@Injectable
({
  providedIn: 'root'
})

export class DirectionsApiClient extends HttpClient{

  public baseUrl: string = 'https://api.mapbox.com/directions/v5/mapbox/driving';

  constructor(handler: HttpHandler){
    super(handler);

  }

  public override get<T>(url:string, options?: {

    params?: HttpParams | {
      [param: string]: string | number | boolean | ReadonlyArray<string | number | boolean>;
  };

  }){

    url = this.baseUrl + url;

    return super.get<T>(url, {
      params: {
        alternatives: 'false',
        geometries: 'geojson',
        language: 'es',
        steps: 'false',
        overview: 'simplified',
        access_token: environment.apikey,
        ...options?.params
      }
    });
  }
}
