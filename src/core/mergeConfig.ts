import { isPlainObject, deepMerge } from "../helpers/utils";
import { AxiosRequestConfig } from "../types";

export default function mergeConfig(defaultCon: AxiosRequestConfig, paramsCon?: AxiosRequestConfig): AxiosRequestConfig {
    if (!paramsCon) {
        paramsCon = {}
    }

    const strategyMap = Object.create(null)
    const config: AxiosRequestConfig = {}

    const keysFromV2 = ['url', 'data', 'params']
    keysFromV2.forEach(k => {
        strategyMap[k] = fromV2Strategy
    })
    const keysDeepMerge = ['headers']
    keysDeepMerge.forEach(k => {
        strategyMap[k] = deepMergeStrategy
    })
    
    for(let k in paramsCon) {
        mergeFiled(k)
    }
    for(let k in defaultCon) {
        if(!paramsCon[k]) mergeFiled(k)
    }

    function mergeFiled(key: string): void {
        const strategy = strategyMap[key] || defaultStrategy
        config[key] = strategy(defaultCon[key], paramsCon![key])
    }
    function defaultStrategy(v1: any, v2: any): any {
        return v2 === undefined ? v1 : v2
    }
    function fromV2Strategy(v1: any, v2: any): any {
        if (v2 !== undefined) return v2
    }
    function deepMergeStrategy(v1: any, v2: any): any {
        if (isPlainObject(v2)) {
            return deepMerge(v1, v2)
        } else if (v2 !== undefined) {
            return v2
        } else if (isPlainObject(v1)) {
            return deepMerge(v1)
        } else if (v1 !== undefined) {
            return v1
        }
    }
 
    return config
}