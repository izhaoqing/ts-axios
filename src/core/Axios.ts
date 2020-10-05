import { AxiosRequestConfig, AxiosPromise, Method } from '../types'
import dispatchRequest from './dispatchRequest'

export default class Axios {
    request(config: AxiosRequestConfig): AxiosPromise {
        return dispatchRequest(config)
    }

    get(url: string, config?: AxiosRequestConfig): AxiosPromise {
        return this._requestMethodWithoutData('get', url, config)
    }

    delete(url: string, config?: AxiosRequestConfig): AxiosPromise {
        return this._requestMethodWithoutData('delete', url, config)
    }

    options(url: string, config?: AxiosRequestConfig): AxiosPromise {
        return this._requestMethodWithoutData('options', url, config)
    }

    head(url: string, config?: AxiosRequestConfig): AxiosPromise {
        return this._requestMethodWithoutData('head', url, config)
    }

    post(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise {
        return this._requestMethodWithtData('post', url, data, config)
    }

    put(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise {
        return this._requestMethodWithtData('put', url, data, config)
    }

    patch(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise {
        return this._requestMethodWithtData('patch', url, data, config)
    }

    _requestMethodWithoutData(method: Method, url: string, config?: AxiosRequestConfig): AxiosPromise {
        return this.request(Object.assign(config || {}, {
            url,
            method
        }))
    }

    _requestMethodWithtData(method: Method, url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise {
        return this.request(Object.assign(config || {}, {
            url,
            method,
            data
        }))
    }
}
