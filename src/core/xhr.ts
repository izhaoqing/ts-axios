import { AxiosRequestConfig, AxiosPromise, AxiosResponse } from '../types'
import { parseHeaders } from '../helpers/headers'
import { createError } from '../helpers/error'
import { isURLSameOrigin } from '../helpers/url'
import cookie from '../helpers/cookie'
import { isFormData } from '../helpers/utils'

export default function xhr(config: AxiosRequestConfig): AxiosPromise {
    return new Promise((resolve, reject) => {
        const {
            data = null,
            method,
            url,
            headers,
            responseType,
            timeout,
            cancelToken,
            withCredentials,
            xsrfCookieName,
            xsrfHeaderName,
            onDownloadProgress,
            onUploadProgress,
            auth,
            validateStatus,
        } = config

        const request = new XMLHttpRequest()

        request.open(method!.toUpperCase(), url!, true)

        configureRequest()
        addEvents()
        processHeaders()
        requestCancel()

        request.send(data)

        function configureRequest() {
            if (responseType) {
                request.responseType = responseType
            }

            // timeout 默认是0，表示不超时，单位是毫秒
            if (timeout) {
                request.timeout = timeout
            }

            if (withCredentials) {
                request.withCredentials = true
            }

            if (auth) {
                headers['Authorization'] = 'Basic ' + btoa(auth.username + ':' + auth.password)
            }
        }

        function addEvents() {
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
    
                if (!validateStatus || validateStatus(request.status)) {
                    resolve(response)
                } else {
                    reject(createError(`Request failed with status code ${request.status}`, config, null, request, response))
                }
            }
    
            // 网络错误
            request.onerror = () => {
                reject(createError('Network Error', config, null, request))
            }
    
            // 超时
            request.ontimeout = () => {
                reject(createError(`Timeout of ${timeout} ms exceeded`, config, 'ECONNABORTED', request))
            }

            if (onDownloadProgress) {
                request.onprogress = onDownloadProgress
            }
            if (onUploadProgress) {
                request.upload.onprogress = onUploadProgress
            }
        }

        function processHeaders() {
            if ((withCredentials || isURLSameOrigin(url!)) && xsrfCookieName) {
                const xsrfValue = cookie.read(xsrfCookieName)
                if (xsrfValue) {
                    headers[xsrfHeaderName!] = xsrfValue
                }
            }
    
            // 让浏览器自己设置
            if (isFormData(data)) {
                delete headers['Content-Type']
            }
    
            Object.keys(headers).forEach((name) => {
                // 没有 data 时，Content-Type 没有意义，可以删掉
                if (data === null && name.toLowerCase() === 'content-type') {
                    delete headers[name]
                } else {
                    request.setRequestHeader(name, headers[name])
                }
            })
        }

        // 请求取消
        function requestCancel() {
            if (cancelToken) {
                cancelToken.promise.then(reason => {
                    request.abort()
                    reject(reason)
                })
            }
        }
    })
}
