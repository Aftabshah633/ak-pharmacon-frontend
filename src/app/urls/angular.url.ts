
export const modulesUrl = {
    product: 'product',
    billing: 'billing',
    user: 'user'
}

export const productRouting = {
    home: '',
    create: 'create',
    createBatch: 'batch/create'
}

export const userRouting = {
    login: `login`
}

export const productUrl = {
    home: `${modulesUrl.product}`,
    create: `${modulesUrl.product}/${productRouting.create}`,
    createBatch:  `${modulesUrl.product}/${productRouting.createBatch}`
}

export const billingUrl = {
    home: `${modulesUrl.billing}`
}

export const userUrl = {
    login: `${modulesUrl.user}/${userRouting.login}`
}


