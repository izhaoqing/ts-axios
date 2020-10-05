import { AxiosInstance } from './types'
import Axios from './core/Axios'
import { extend } from './helpers/utils'

function createInstance(): AxiosInstance {
    const axios = new Axios()
    const instance = Axios.prototype.request.bind(axios)
    extend(instance, axios)
    return instance as AxiosInstance
}

export default createInstance()
