import axios from '../../src/index'

// 404
axios({
    method: 'get',
    url: '/error/get1'
}).then(res => {
    console.log(res)
}).catch(res => {
    console.log(res)
})

// 模拟正常接口和非 200
axios({
    method: 'get',
    url: '/error/get'
}).then(res => {
    console.log(res)
}).catch(res => {
    console.log(res)
})

// 模拟超时
axios({
    method: 'get',
    url: '/error/timeout',
    timeout: 2000
}).then(res => {
    console.log(res)
}).catch(res => {
    console.log(res)
})

// 刷新页面后，设置网络为 offline，可以模拟网络问题
setTimeout(() => {
    axios({
        method: 'get',
        url: '/error/get'
    }).then(res => {
        console.log(res)
    }).catch(res => {
        console.log(res)
    })
}, 5000)
