import { CancelExecutor, CancelTokenSource, Canceler } from '../types'
import Cancel from './Cancel'

interface ResolvePromise {
    (reason?: Cancel): void
}

export default class CancelToken {
    promise: Promise<Cancel>
    reason?: Cancel

    constructor(executor: CancelExecutor) {
        let resPromise: ResolvePromise
        this.promise = new Promise<Cancel>(res => {
            resPromise = res as ResolvePromise
        })
        executor(message => {
            if (this.reason) {
                return
            }
            this.reason = new Cancel(message)
            resPromise(this.reason)
        })
    }

    throwIfRequested() {
        if (this.reason) {
            throw this.reason
        }
    }

    static source(): CancelTokenSource {
        let cancel!: Canceler
        const token = new CancelToken(res => {
            cancel = res
        })
        return {
            token,
            cancel
        }
    }
}
