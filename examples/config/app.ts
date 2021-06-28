import axios from '../../src'

axios.defaults.headers.common['test'] = 123

axios({
    method: 'post',
    url: '/config/post',
    data: {
        a: 1
    },
    headers: {
        test: 321
    }
}).then(res => {
    console.log(res)
})
