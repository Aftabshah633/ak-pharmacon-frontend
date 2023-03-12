import { environment } from "src/environments/environment"

export const apiPrefixs = {
    product: `${environment.domain}/product`,
    billing: `${environment.domain}/bill`,
    company: `${environment.domain}/company`,
    client: `${environment.domain}/client`,
}

export const productApiUrl = {
    getAllProducts: `${apiPrefixs.product}/all`,
    createProduct: `${apiPrefixs.product}/create`,
    createBatch: `${apiPrefixs.product}/batch`,
    updateBatch: `${apiPrefixs.product}/batch`,
    batchIncrementableQuantity: `${apiPrefixs.product}/batch/incrementabl-quantity`,
    getProductById: `${apiPrefixs.product}`
}

export const companyApiUrl = {
    getAllCompanies: `${apiPrefixs.company}/all`
}

export  const clientApiUrl = {
    getAllClients: `${apiPrefixs.client}/all`
}

export const billApiUrl = {
    createBill: `${apiPrefixs.billing}/create`
}