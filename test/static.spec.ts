import axios from '../src/index'

describe('promise', () => {
    test('should support all', done => {
        axios.all([true]).then(arg=> {
            expect(arg[0]).toBeTruthy()
            done();
        })
    })

    test('should support spread', () => {
        return axios.all([1, 2]).then(axios.spread((a, b) => {
            expect(a + b).toBe(1 + 2)
        }))
    })
})
