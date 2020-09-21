import axios from '../../src/index'

axios({
    method: 'post',
    url: '/base/post',
    responseType: 'json',
    data: {
        a: {
            b: 1
        }
    }
}).then(res => {
    console.log(res)
})

axios({
    method: 'post',
    url: '/base/buffer',
    data: new Int32Array([21, 31])
})
