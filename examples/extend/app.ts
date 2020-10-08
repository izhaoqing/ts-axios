import axios from '../../src'

axios.get('/extend/get').then(res => {
    console.log(res)
})

axios('/extend/get', {
    method: 'get'
}).then(res => {
    console.log(res)
})

interface User {
    name: string
    age: number
}

axios.get<User>('/extend/user').then(res => {
    // res.data 是 User 类型，可以做类型推断
    console.log(res.data.age);
})
