import { ResolvedFn, RejectedFn } from '../types'

interface Interceptor<T> {
    resolved: ResolvedFn<T>
    rejected?: RejectedFn
}

export default class InterceptorManager<T> {
    private interceptors: Array<Interceptor<T> | null>
    
    constructor() {
        this.interceptors = []
    }

    use(resolved: ResolvedFn<T>, rejected: RejectedFn): number {
        this.interceptors.push({
            resolved,
            rejected
        })
        return this.interceptors.length - 1
    }

    // 删除拦截器
    eject(id: number): void {
        if (this.interceptors[id]) {
            this.interceptors[id] = null
        }
    }

    // 遍历拦截器
    forEach(fn: (interceptor: Interceptor<T>) => void): void {
        this.interceptors.forEach(item => {
            if (item !== null) fn(item)
        })
    }
}
