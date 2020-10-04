import { AxiosRequestConfig, AxiosPromise, AxiosResponse } from './types'
import { parseHeaders } from './helpers/headers'

export default function xhr(config: AxiosRequestConfig): AxiosPromise {
    return new Promise((resolve, reject) => {

        const { data = null, method = 'get', url, headers, responseType, timeout } = config

        const request = new XMLHttpRequest()

        if (responseType) {
            request.responseType = responseType
        }

        // timeout 默认是0，表示不超时，单位是毫秒
        if (timeout) {
            request.timeout = timeout
        }

        request.open(method.toUpperCase(), url, true)

        request.onreadystatechange = () => {
            if (request.readyState !== 4) return
            const responseHeader = request.getAllResponseHeaders()
            const responseData = responseType !== 'text' ? request.response : request.responseText
            const response: AxiosResponse = {
                data: responseData,
                status: request.status,
                statusText: request.statusText,
                headers: parseHeaders(responseHeader),
                config,
                request
            }
            resolve(response)
        }

        // 网络错误
        request.onerror = () => {
            reject(new Error('Network Error'))
        }

        // 超时
        request.ontimeout = () => {
            reject(new Error(`Timeout of ${timeout} ms exceeded`))
        }

        Object.keys(headers).forEach((name) => {
            // 没有 data 时，Content-Type 没有意义，可以删掉
            if (data === null && name.toLowerCase() === 'content-type') {
                delete headers[name]
            } else {
                request.setRequestHeader(name, headers[name])
            }
        })

        request.send(data)
    })
}
