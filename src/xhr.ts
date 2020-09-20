import { AxiosRequestConfig } from './types'

export default function xhr(config: AxiosRequestConfig): void {
    const { data = null, method = 'get', url, headers } = config
    const request = new XMLHttpRequest()
    request.open(method.toUpperCase(), url, true)
    Object.keys(headers).forEach((name) => {
        // 没有 data 时，Content-Type 没有意义，可以删掉
        if (data === null && name.toLowerCase() === 'content-type') {
            delete headers[name]
        } else {
            request.setRequestHeader(name, headers[name])
        }
    })
    request.send(data)
}
