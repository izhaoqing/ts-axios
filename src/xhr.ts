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
            // 异常情况 status 也是 0，因为请求完成之前是 0，出现异常后没再改变
            // https://developer.mozilla.org/zh-CN/docs/Web/API/XMLHttpRequest/status
            if (request.status === 0) return

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

            if (request.status >= 200 && request.status < 300) {
                resolve(response)
            } else {
                reject(new Error(`Request failed with status code ${request.status}`))
            }
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
