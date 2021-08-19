import { AxiosRequestConfig, AxiosPromise, Method, AxiosResponse, ResolvedFn, RejectedFn } from '../types'
import dispatchRequest, { transformUrl } from './dispatchRequest'
import InterceptorManager from './interceptor'
import mergeConfig from './mergeConfig'

interface Interceptors {
    request: InterceptorManager<AxiosRequestConfig>
    response: InterceptorManager<AxiosResponse>
}
interface PromiseChain {
    resolved: ResolvedFn | ((config: AxiosRequestConfig) => AxiosPromise)
    rejected?: RejectedFn
}

export default class Axios {
    defaults: AxiosRequestConfig
    interceptors: Interceptors

    constructor(initConfig: AxiosRequestConfig) {
        this.defaults = initConfig
        this.interceptors = {
            request: new InterceptorManager<AxiosRequestConfig>(),
            response: new InterceptorManager<AxiosResponse>()
        }
    }

    // 可以传一个 option 参数，也可以传两个参数
    request(url: any, config?: any): AxiosPromise {
        if (typeof url === 'string') {
            config = config || {}
            config.url = url
        } else {
            config = url
        }
        config = mergeConfig(this.defaults, config)
        config.method = config.method.toLowerCase()
        // return dispatchRequest(config)
        const chain: PromiseChain[] = [
            {
                resolved: dispatchRequest
            }
        ]
        // 先遍历请求拦截器插入到 chain 的前面
        this.interceptors.request.forEach((interceptor) => {
            chain.unshift(interceptor)
        })
        // 再遍历响应拦截器插入到 chain 后面
        this.interceptors.response.forEach((interceptor) => {
            chain.push(interceptor)
        })
        let promise = Promise.resolve(config)
        while(chain.length) {
            // 数组的 shift 可能返回 undefined, 这里 chain.length > 0 才会执行，添加!表示确定有值
            const { resolved, rejected } = chain.shift()!
            promise = promise.then(resolved, rejected)
        }
        return promise
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
        return this._requestMethodWithData('post', url, data, config)
    }

    put(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise {
        return this._requestMethodWithData('put', url, data, config)
    }

    patch(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise {
        return this._requestMethodWithData('patch', url, data, config)
    }

    getUri(config: AxiosRequestConfig) {
        config = mergeConfig(this.defaults, config)
        return transformUrl(config)
    }

    _requestMethodWithoutData(method: Method, url: string, config?: AxiosRequestConfig): AxiosPromise {
        return this.request(Object.assign(config || {}, {
            url,
            method
        }))
    }

    _requestMethodWithData(method: Method, url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise {
        return this.request(Object.assign(config || {}, {
            url,
            method,
            data
        }))
    }
}
