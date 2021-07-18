export const BadRequest = (message = null) => {
    throw { message: message ? message : 'Bad Request' , code : 400 }
}

export const Unauthorized = (message = null) => {
    throw { message: message ? message : 'Unauthorized' , code : 401 }
}

export const PaymentRequired = (message = null) => {
    throw { message: message ? message : 'Payment Required' , code : 402 }
}

export const Forbidden = (message = null) => {
    throw { message: message ? message : 'Forbidden' , code : 403 }
}

export const NotFound = (message = null) => {
    throw { message: message ? message : 'Not Found' , code : 404 }
}
export const ServerError = (message = null) => {
    throw { message: message ? message : 'Internal Server Error' , code : 500 }
}

