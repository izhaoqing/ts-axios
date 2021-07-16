const toString = Object.prototype.toString

// is 为类型谓词
export function isDate(val: any): val is Date {
    return toString.call(val) === '[object Date]'
}

export function isObject(val: any): val is Object {
    return val !== null && typeof val === 'object'
}

export function isPlainObject(val: any): val is Object {
    return toString.call(val) === '[object Object]'
}

export function extend<T, U> (to: T, from: U): T & U {
    for (const key in from) {
        (to as T & U)[key] = from[key] as any
    }
    return to as T & U
}

export function isFormData(val: any) {
    return typeof val !== 'undefined' && val instanceof FormData
}

export function deepMerge(...objs: any[]): any {
    const result = Object.create(null)
    objs.forEach(obj => {
        if (obj) {
            Object.keys(obj).forEach(k => {
                const v = obj[k]
                if (isPlainObject(v)) {
                    if (isPlainObject(result[k])) {
                        result[k] = deepMerge(result[k], v)
                    } else {
                        result[k] = deepMerge({}, v)
                    }
                } else {
                    result[k] = v
                }
            })
        }
    })
    return result
}
