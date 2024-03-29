import { AxiosRequestConfig, AxiosPromise, AxiosResponse } from '../types'
import xhr from './xhr'
import { buildURL, isAbsoluteURL, combineURL } from '../helpers/url'
// import { transformRequest, transformResponse } from '../helpers/data'
import { flattenHeaders } from '../helpers/headers'
import transform from './transform'

export default function dispatchRequest(config: AxiosRequestConfig): AxiosPromise {
    throwIfCancellationRequested(config)
    processConfig(config)
    return xhr(config)
        .then(res => {
            return transformResponseData(res)
        })
        .catch(e => {
            if (e && e.response) {
                e.response = transformResponseData(e.response)
            }
            return Promise.reject(e)
        })
}

function processConfig(config: AxiosRequestConfig): void {
    config.url = transformUrl(config)
    // config.headers = transformHeaders(config)
    // config.data = transformRequestData(config)
    config.data = transform(config.data, config.headers, config.transformRequest)
    config.headers = flattenHeaders(config.headers, config.method!)
}

export function transformUrl(config:AxiosRequestConfig): string {
    const { params, paramsSerializer, baseURL } = config
    let { url } = config
    if (baseURL && !isAbsoluteURL(url!)) {
        url = combineURL(baseURL, url)
    }
    return buildURL(url!, params, paramsSerializer)
}

function transformResponseData(res: AxiosResponse): AxiosResponse {
    res.data = transform(res.data, res.headers, res.config.transformResponse)
    return res
}

function throwIfCancellationRequested(config: AxiosRequestConfig) {
    if (config.cancelToken) {
        config.cancelToken.throwIfRequested()
    }
}
