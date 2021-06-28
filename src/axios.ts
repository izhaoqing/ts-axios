import { AxiosInstance, AxiosRequestConfig } from './types'
import Axios from './core/Axios'
import { extend } from './helpers/utils'
import defaults from './defaults'

function createInstance(config: AxiosRequestConfig): AxiosInstance {
    const axios = new Axios(config)
    const instance = Axios.prototype.request.bind(axios)
    extend(instance, axios)
    return instance as AxiosInstance
}

export default createInstance(defaults)
