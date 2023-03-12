import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClientRoutingModule } from './client-routing.module';
import { ClientService } from './service/client.service';
import { ProductService } from '../product/services/product.service';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ClientRoutingModule
  ],
  providers: [
    ProductService
  ]
})
export class ClientModule { }
