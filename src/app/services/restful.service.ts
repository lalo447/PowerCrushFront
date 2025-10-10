import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../enviroment.ts/enviroment';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';

type HttpOptions = {
  headers?: HttpHeaders;
  params?: HttpParams;
};

@Injectable({ providedIn: 'root' })
export class RestfulService {
  constructor(private http: HttpClient) {}
  private apiUrl = environment.api;
  /**
   * Performs a GET request.
   * @param url The URL to send the request to.
   * @param options Optional HTTP options such as headers and params.
   * @returns An Observable of the response body typed as TResponse.
   */
  get<TResponse>(url: string, options?: HttpOptions): Observable<TResponse> {
    return this.http.get<TResponse>(`${this.apiUrl}/${url}`, options);
  }

  /**
   * Performs a POST request.
   * @param url The URL to send the request to.
   * @param body The body of the request.
   * @param options Optional HTTP options such as headers and params.
   * @returns An Observable of the response body typed as TResponse.
   */
  post<TResponse, TBody = unknown>(url: string, body: TBody, options?: HttpOptions): Observable<TResponse> {
    return this.http.post<TResponse>(`${this.apiUrl}/${url}`, body, options);
  }

  /**
   * Performs a PUT request.
   * @param url The URL to send the request to.
   * @param body The body of the request.
   * @param options Optional HTTP options such as headers and params.
   * @returns An Observable of the response body typed as TResponse.
   */
  put<TResponse, TBody = unknown>(url: string, body: TBody, options?: HttpOptions): Observable<TResponse> {
    return this.http.put<TResponse>(`${this.apiUrl}/${url}`, body, options);
  }

  /**
   * Performs a DELETE request.
   * @param url The URL to send the request to.
   * @param options Optional HTTP options such as headers and params.
   * @returns An Observable of the response body typed as TResponse.
   */
  delete<TResponse>(url: string, options?: HttpOptions): Observable<TResponse> {
    return this.http.delete<TResponse>(`${this.apiUrl}/${url}`, options);
  }
}
