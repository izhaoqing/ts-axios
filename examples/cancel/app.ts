import axios from '../../src/index'

const CancelToken = axios.CancelToken
const source = CancelToken.source()

axios.get('/a', {
    cancelToken: source.token
}).catch(e => {
    if (axios.isCancel(e)) {
        console.log('Request canceled')
    }
})

setTimeout(() => {
    source.cancel('cancel')
    axios.post('/b', {}, {
        cancelToken: source.token
    }).catch(e => {
        if (axios.isCancel(e)) {
            console.log(e.message)
        }
    })
}, 100)
