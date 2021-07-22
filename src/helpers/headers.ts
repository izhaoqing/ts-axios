import { Method } from '../types'
import { deepMerge, isPlainObject } from './utils'

const up = (str: string): string => str.toUpperCase()

// headerName 大小写处理
function normalizeHeaderName(header: any, normalizedName: string): void {
    if (header[normalizedName]) {
        return
    }
    Object.keys(header).forEach((name) => {
        if (name !== normalizedName && up(name) === up(normalizedName)) {
            header[normalizedName] = header[name]
            delete header[name]
        }
    })
}

// 如果 data 是 json 对象，需要正确设置 Content-Type
export function processHeaders(headers: any, data: any): any {
    normalizeHeaderName(headers, 'Content-Type')
    if (isPlainObject(data)) {
        if (headers && !headers['Content-Type']) {
            headers['Content-Type'] = 'application/json;charset=utf-8'
        }
    }
    return headers
}

export function parseHeaders(headers: string): any {
    // # 声明空对象
    const parsed = Object.create(null)
    if (!headers) return parsed

    headers.split('\r\n').forEach(line => {
        let [key, ...val] = line.split(':')
        key = key.trim().toLowerCase()
        if (!key) return
        parsed[key] = val.join(';').trim()
    })
    return parsed
}

export function flattenHeaders(headers: any, method: Method): any {
    if (!headers) return headers
    headers = deepMerge(headers.common, headers[method], headers)
    const keys = ['delete', 'get', 'post', 'head', 'options', 'put', 'patch', 'common']
    keys.forEach(k => delete headers[k])
    return headers
}
