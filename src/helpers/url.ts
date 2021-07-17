import { isDate, isPlainObject, isURLSearchParams } from './utils'

interface URLOrigin {
    protocol: string
    host: string
}

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

export function buildURL(url: string, params?: any, paramsSerializer?: (params: any) => string): string {
    if (!params) {
        return url
    }

    let serializedParams = ''

    if (paramsSerializer) {
        serializedParams = paramsSerializer(params)
    } else if (isURLSearchParams(params)) {
        serializedParams = params.toString()
    } else {
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
        serializedParams = parts.join('&')
    }
    
    if (serializedParams) {
        const markIndex = url.indexOf('#')
        if (markIndex !== -1) url = url.slice(0, markIndex)
        url += url.includes('?') ? '&' : '?'  + serializedParams
    }
    return url
}

// 判断是否同域
export function isURLSameOrigin(requestURL: string) {
    const parsedOrigin = resolveURL(requestURL)
    return currentOrigin.protocol === parsedOrigin.protocol && currentOrigin.host === parsedOrigin.host
}

const urlParsingNode = document.createElement('a')
const currentOrigin = resolveURL(window.location.href)

function resolveURL(url: string): URLOrigin {
    urlParsingNode.setAttribute('href', url)
    const { protocol, host } = urlParsingNode
    return { protocol, host }
}
