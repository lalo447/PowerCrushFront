import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})

export class RestfulService {

constructor(private http: HttpClient){ }

  /**
   * Fetches data from a REST API endpoint.
   * @param url - The endpoint URL to fetch data from.
   * @returns An observable that emits the fetched data.
   */
   public get<T>(url: string): Observable<T[]> {
    return this.http.get<T[]>(url);
  }
}
