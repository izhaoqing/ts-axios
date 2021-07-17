import { AxiosRequestConfig, AxiosStatic } from './types'
import Axios from './core/Axios'
import { extend } from './helpers/utils'
import defaults from './defaults'
import mergeConfig from './core/mergeConfig'
import CancelToken from './cancel/CancelToken'
import Cancel, { isCancel } from './cancel/Cancel'

function createInstance(config: AxiosRequestConfig) {
    const axios = new Axios(config)
    const instance = Axios.prototype.request.bind(axios)
    extend(instance, axios)
    return instance as AxiosStatic
}

const axios = createInstance(defaults)
axios.create = function(config?: AxiosRequestConfig) {
    return createInstance(mergeConfig(defaults, config))
}
axios.CancelToken = CancelToken
axios.Cancel = Cancel
axios.isCancel = isCancel

axios.all = function(promises) {
    return Promise.all(promises)
}
axios.spread = function(cb) {
    return function(arr) {
        return cb.apply(null, arr)
    }
}
axios.Axios = Axios

export default axios
