import { AxiosRequestConfig, AxiosStatic } from './types'
import Axios from './core/Axios'
import { extend } from './helpers/utils'
import defaults from './defaults'
import mergeConfig from './core/mergeConfig'

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

export default axios
