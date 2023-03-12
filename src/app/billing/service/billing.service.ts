import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { billApiUrl } from 'src/app/urls/api.url';

@Injectable({
  providedIn: 'root'
})
export class BillingService {

  constructor(private http: HttpClient) { }

  createBill(billInformation: any){
    return this.http.post(billApiUrl.createBill,billInformation)
  }
}
