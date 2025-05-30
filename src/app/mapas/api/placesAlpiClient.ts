import { HttpClient, HttpHandler, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { access } from "fs";
import { environment } from "../../environments/environment.prod";

@Injectable
({
  providedIn: 'root'
})

export class PlacesAlpiClient extends HttpClient{

  public baseUrl: string = 'https://api.mapbox.com/geocoding/v5/mapbox.places';

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
        limit: '5',
        language: 'es',
        access_token: environment.apikey,
        ...options?.params
      }
    });
  }
}
