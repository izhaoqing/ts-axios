import { isPlainObject } from './utils'

export function transformRequest(data: any): any {
    if (isPlainObject(data)) {
        return JSON.stringify(data)
    }
    return data
}

// 响应数据为字符串类型的 json, 需要解析
export function transformResponse(data: any): any {
    if (typeof data === 'string') {
        try {
            data = JSON.parse(data)
        } catch {
            //
        }
    }
    return data
}