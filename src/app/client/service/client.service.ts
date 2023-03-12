import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { clientApiUrl } from 'src/app/urls/api.url';

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  constructor(
    private http: HttpClient
  ) { }

  getAllClients() {
    return this.http.get(clientApiUrl.getAllClients);
  }
}
