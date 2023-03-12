import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { BillingHomeComponent } from './billing-home/billing-home.component';
import { BillingRoutingModule } from './billing-routing.module';
import { CreateBillComponent } from './create-bill/create-bill.component';
import { ProductService } from '../product/services/product.service';
import { ClientService } from '../client/service/client.service';



@NgModule({
  declarations: [
    BillingHomeComponent,
    CreateBillComponent
  ],
  imports: [
    CommonModule,
    BillingRoutingModule,
    SharedModule
  ],
  providers: [
    ProductService,
    ClientService
  ]
})
export class BillingModule { }
