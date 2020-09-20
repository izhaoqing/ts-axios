import { isDate, isPlainObject } from './utils'

function encode(val: string): string {
    return encodeURIComponent(val)
        .replace(/%40/g, '@')
        .replace(/%3A/ig, ':')
        .replace(/%24/g, '$')
        .replace(/%2C/ig, ',')
        .replace(/%20/g, '+')
        .replace(/%5B/ig, '[')
        .replace(/%5D/ig, ']')
}

export function buildURL(url: string, params?: any): string {
    if (!params) {
        return url
    }

    const parts: string[] = []

    Object.keys(params).forEach((key) => {
        const val = params[key]
        if (val === null || val === undefined) {
            return
        }

        let values = []
        if (Array.isArray(val)) {
            key += '[]'
            values = val
        } else {
            values = [val]
        }

        values.forEach((value) => {
            if (isDate(value)) {
                 value = value.toUTCString()
            } else if(isPlainObject(value)) {
                value = JSON.stringify(value)
            }
            parts.push(encode(key) + '=' + encode(value))
        })
    })

    const serializedParams = parts.join('&')
    if (serializedParams) {
        const markIndex = url.indexOf('#')
        if (markIndex !== -1) url = url.slice(0, markIndex)
        url += url.includes('?') ? '&' : '?'  + serializedParams
    }

    return url;
}