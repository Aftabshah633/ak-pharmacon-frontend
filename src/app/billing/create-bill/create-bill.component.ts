import { Component } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ClientService } from 'src/app/client/service/client.service';
import { ProductService } from 'src/app/product/services/product.service';
import { AlertType } from '../../shared/error-success/error-success.component';
import { BillingService } from '../service/billing.service';

@Component({
  selector: 'app-createinvoice',
  templateUrl: './create-bill.component.html',
  styleUrls: ['./create-bill.component.scss'],
})
export class CreateBillComponent {
  pagetitle = 'Create Bill';
  clientList: any;
  productList: any;
  batchList: any;

  newProductUi = false;

  clientSearchedAvailableOptions: any = [];
  productSearchedAvailableOptions: any = [];
  batchSearchedAvailableOptions: any = [];

  selectedClient: any;
  selectedProduct: any;
  selectedBatch: any;

  billDetail: any = {
    products: [],
  };

  productAlerts = {
    createBillValidationError: false,
  };

  createBillValidationErrorInfo = {
    type: AlertType.error,
    message: '',
  };

  constructor(
    private clientService: ClientService,
    private productService: ProductService,
    private billingService: BillingService
  ) {}

  productForm = new FormGroup({
    quantity: new FormControl<number>(0, [
      Validators.required,
      Validators.min(0),
      Validators.pattern('^[0-9]*$'),
    ]),
    free: new FormControl<number>(0, [
      Validators.required,
      Validators.min(0),
      Validators.pattern('^[0-9]*$'),
    ]),
    discountPercent: new FormControl<number>(0, [
      Validators.required,
      Validators.min(0),
      Validators.pattern('^[0-9]*$'),
    ]),
  });

  get QuantityField() {
    return this.productForm.get('quantity');
  }
  get FreeField() {
    return this.productForm.get('free');
  }
  get DiscountPercentField() {
    return this.productForm.get('discountPercent');
  }

  getFormData() {
    console.log(this.productForm.value);
  }

  batchProductAdditionalValidation() {
    let validationError = [];
    if (!this.selectedProduct) {
      validationError.push('Product Should be selected');
    }
    if (!this.selectedBatch) {
      validationError.push('Batch Should be selected');
    }

    if (Array.isArray(this.billDetail.products)) {
      let currentTotalQuantity;
      if (this.productForm.value.free && this.productForm.value.quantity) {
        currentTotalQuantity =
          this.productForm.value.free + this.productForm.value.quantity;

        if (this.selectedBatch.saleQuantity < currentTotalQuantity) {
          validationError.push(
            `Qty+free should not be more than ${this.selectedBatch.saleQuantity}. Your qty+free is ${currentTotalQuantity}`
          );
        }
      }

      // to check if duplicate batch for specific product is added
      for (const alreadyAddedProduct of this.billDetail.products) {
        if (
          alreadyAddedProduct.productId === this.selectedProduct._id &&
          this.selectedBatch.batchNumber === alreadyAddedProduct.batchNumber
        ) {
          validationError.push(
            `Product ${this.selectedProduct.name} with batch ${this.selectedBatch.batchNumber} already added`
          );
          break;
        }
      }
    }

    return validationError;
  }

  addProduct() {
    // while addidng product make sure seected quantity< available quantity
    const batchProductValidation = this.batchProductAdditionalValidation();
    if (this.productForm.invalid || batchProductValidation.length > 0) {
      this.productForm.markAllAsTouched();
      this.createBillValidationErrorInfo.message =
        batchProductValidation.join(',');
      this.productAlerts.createBillValidationError = true;
      return;
    }
    let productDetails = {
      productId: this.selectedProduct._id,
      name: this.selectedProduct.name,
      company: this.selectedProduct.company._id,
      productType: this.selectedProduct.productType,
      productCategory: this.selectedProduct.productCategory,
      hsnCode: this.selectedProduct.hsnCode,

      batchNumber: this.selectedBatch.batchNumber,
      expirydate: this.selectedBatch.expirydate,
      saleCgstPercent: this.selectedBatch.saleCgstPercent,
      saleSgstPercent: this.selectedBatch.saleSgstPercent,
      saleIgstPercent: this.selectedBatch.saleIgstPercent,
      totalTax: this.selectedBatch.totalTax,
      margin: this.selectedBatch.margin,
      mrp: this.selectedBatch.mrp,
      saleRate: this.selectedBatch.saleRate,
      purchaseRate: this.selectedBatch.purchaseRate,
      invoiceRate: this.selectedBatch.invoiceRate,
      saleCgstAmount: this.selectedBatch.saleCgstAmount,
      saleSgstAmount: this.selectedBatch.saleSgstAmount,
      saleIgstAmount: this.selectedBatch.saleIgstAmount,
      totalAmountExcludingTax: this.selectedBatch.totalAmountExcludingTax,
      totalAmount: this.selectedBatch.totalAmount,
      outer: this.selectedBatch?.outer,

      ...this.productForm.value,
    };
    // First Validate duplicate products/batchNumber are not inserted in bill then only push
    // (need to confirm if we will allow same product with different batch number)

    // make sure quantity + free <= batch quantity
    // make sure quantity and free and discount is number
    this.billDetail.products.push(productDetails);
    console.log('Product detail: ', productDetails);
    console.log('current Bill: ', this.billDetail);

    this.calculateTotalAmountAndTax();

    // If valid then push in product Array else return
    // this.getDetails.push(this.productFormGroup)

    // after successfullProcessing
    (this.selectedBatch = null), (this.selectedProduct = null);
    this.productForm.reset();
    this.newProductUi = false;
  }

  deleteProduct(index: number) {
    // this.getDetails.removeAt(index);
  }

  createBill() {
    // Show alert when billing info is incorrect
    if (this.billDetail.products.length === 0) {
      console.error('in valid billing details', this.billDetail);
      return;
    }
    console.log('Bill to be created: ', this.billDetail);
    this.billingService.createBill(this.billDetail).subscribe(
      (data) => {
        console.log('Bill Created', data);
      },
      (error) => {
        console.error('Failed to create bill', error);
      }
    );
  }

  // CLIENT SEARCH OPTION START
  onClientNameFocus() {
    this.clientSearchedAvailableOptions = this.clientList;
  }

  onClientNameSearch($event: any) {
    const value = $event.target.value.toLowerCase();
    this.clientSearchedAvailableOptions = this.clientList.filter(
      (client: any) => client.name.includes(value)
    );
  }

  onClientNameSelect(client: any) {
    this.selectedClient = client;
    console.log(this.selectedClient);
    this.clientSearchedAvailableOptions = [];
    this.billDetail.client = this.selectedClient._id;
    this.billDetail.clientName = this.selectedClient.name;
  }
  // CLIENT SEARCH OPTION END

  // PRODUCT SEARCH OPTION START
  onProductNameFocus() {
    this.productSearchedAvailableOptions = this.productList;
  }

  onProductNameSearch($event: any) {
    const value = $event.target.value.toUpperCase();
    this.productSearchedAvailableOptions = this.productList.filter(
      (product: any) => product.name.includes(value)
    );
  }

  onProductNameSelect(product: any) {
    this.selectedProduct = product;
    console.log(this.selectedProduct);
    this.batchList = product.batch;
    this.selectedBatch = null;
    this.productForm.reset();
    this.productSearchedAvailableOptions = [];
  }
  // PRODUCT SEARCH OPTION END

  // BATCH SEARCH OPTION START
  onBatchNameFocus() {
    this.batchSearchedAvailableOptions = this.batchList;
  }

  onBatchNameSearch($event: any) {
    const value = $event.target.value.toUpperCase();
    this.batchSearchedAvailableOptions = this.batchList.filter((batch: any) =>
      batch.batchNumber.includes(value)
    );
  }

  onBatchNameSelect(batch: any) {
    this.selectedBatch = batch;
    console.log(this.selectedBatch);
    this.productForm.reset();
    this.batchSearchedAvailableOptions = [];
  }
  // BATCH SEARCH OPTION END

  get SeletctedProductQuantity() {
    const qty = this.productForm.get('quantity')?.value;
    console.log('quantity from form: ', qty);

    return qty || 1;
  }
  selectedBatchCalculations() {
    this.selectedBatch.totalAmountExcludingTax =
      this.selectedBatch.saleRate * this.SeletctedProductQuantity;

    this.selectedBatch.saleCgstAmount =
      (this.selectedBatch.totalAmountExcludingTax *
        this.selectedBatch.saleCgstPercent) /
      100;

    this.selectedBatch.saleSgstAmount =
      (this.selectedBatch.totalAmountExcludingTax *
        this.selectedBatch.saleSgstPercent) /
      100;

    this.selectedBatch.saleIgstAmount =
      (this.selectedBatch.totalAmountExcludingTax *
        this.selectedBatch.saleIgstPercent) /
      100;

    this.selectedBatch.totalTax =
      this.selectedBatch.saleCgstAmount +
      this.selectedBatch.saleSgstAmount +
      this.selectedBatch.saleIgstAmount;

    this.selectedBatch.totalAmount =
      this.selectedBatch.totalAmountExcludingTax + this.selectedBatch.totalTax;

    console.log('Exluding tax: ', this.selectedBatch.totalAmountExcludingTax);
    console.log('Total Tax: ', this.selectedBatch.totalTax);
    console.log('Total Amount: ', this.selectedBatch.totalAmount);
  }

  calculateTotalAmountAndTax() {
    this.billDetail.totalCgstAmount = 0;
    this.billDetail.totalSgstAmount = 0;
    this.billDetail.totalIgstAmount = 0;
    this.billDetail.totalTaxAmount = 0;
    this.billDetail.totalAmountExcludingTax = 0;
    this.billDetail.finalAmount = 0;
    this.billDetail.amountToCollect = 0;
    for (const product of this.billDetail.products) {
      this.billDetail.totalCgstAmount += product.saleCgstAmount;
      this.billDetail.totalSgstAmount += product.saleSgstAmount;
      this.billDetail.totalIgstAmount += product.saleIgstAmount;
      this.billDetail.totalTaxAmount += product.totalTax;
      this.billDetail.totalAmountExcludingTax +=
        product.totalAmountExcludingTax;
      this.billDetail.finalAmount += product.totalAmount;
    }
    this.billDetail.amountToCollect = this.billDetail.finalAmount

    console.log(
      this.billDetail.totalCgstAmount,
      this.billDetail.totalSgstAmount,
      this.billDetail.totalIgstAmount,
      this.billDetail.totalTaxAmount,
      this.billDetail.totalAmountExcludingTax,
      this.billDetail.finalAmount
    );
  }

  getClientList() {
    this.clientService.getAllClients().subscribe(
      (data) => {
        console.log('client fetched list', data);

        this.clientList = data;
      },
      (error) => {
        console.error('Failed to get client details', error);
      }
    );
  }

  getProductList() {
    this.productService.getAllProducts().subscribe(
      (data) => {
        console.log('product fetched list', data);
        this.productList = data;
      },
      (error) => {
        console.error('Failed to get product details', error);
      }
    );
  }

  ngOnInit() {
    this.getProductList();
    this.getClientList();
  }
}
