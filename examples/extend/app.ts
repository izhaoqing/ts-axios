import axios from '../../src'

axios.get('/extend/get').then(res => {
    console.log(res)
})

axios('/extend/get', {
    method: 'get'
}).then(res => {
    console.log(res)
})
