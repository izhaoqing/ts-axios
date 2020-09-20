import axios from '../../src/index'

axios({
    method: 'post',
    url: '/base/post',
    data: {
        a: {
            b: 1
        }
    }
})

axios({
    method: 'post',
    url: '/base/buffer',
    data: new Int32Array([21, 31])
})
