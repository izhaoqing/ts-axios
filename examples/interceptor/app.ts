import axios from '../../src/index'

axios.interceptors.request.use(config => {
    config.headers.test += '1'
    return config
})
axios.interceptors.request.use(config => {
    config.headers.test += '2'
    return config
})
axios.interceptors.request.use(config => {
    config.headers.test += '3'
    return config
})

axios.interceptors.response.use(res => {
    res.data.msg += '3'
    return res
})
axios.interceptors.response.use(res => {
    res.data.msg += '2'
    return res
})

axios({
    method: 'get',
    url: '/interceptor/get',
    headers: {
        test: '11'
    },
    params: {
        b: 1,
        a: 2
    },
    data: {
        c: 3,
        d: 5
    }
}).then(res => {
    console.log(res)
})

// const a: AxiosInstance
