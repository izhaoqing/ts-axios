import { isPlainObject } from './utils'

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