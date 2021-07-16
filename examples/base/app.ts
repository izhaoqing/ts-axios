import axios from '../../src/index'

// axios({
//     method: 'post',
//     url: '/base/post',
//     responseType: 'json',
//     data: {
//         a: {
//             b: 1
//         }
//     }
// }).then(res => {
//     console.log(res)
// })

// axios({
//     method: 'post',
//     url: '/base/buffer',
//     data: new Int32Array([21, 31])
// })

axios.post('/base/auth', {
    a: 1,
}, {
    auth: {
        username: 'Yee',
        password: '123456'
    }
}).then(res => {
    console.log(res)
})
