import axios from '../src/axios'
import { getAjaxRequest } from './helper'

describe('headers', () => {
    beforeEach(() => {
        jasmine.Ajax.install()
    })
    afterEach(() => {
        jasmine.Ajax.uninstall()
    })

    test('should use default common headers', () => {
        const headers = axios.defaults.headers.common
        
        axios('/foo')

        return getAjaxRequest().then(req => {
            for (let key in headers) {
                if (headers.hasOwnProperty(key)) {
                    expect(req.requestHeaders[key]).toEqual(headers[key])
                }
            }
        })
    })

    test('should add extra headers for post', () => {
        axios.post('/foo', 'fizz=buzz')

        return getAjaxRequest().then(req => {
            expect(req.requestHeaders['Content-Type']).toEqual('application/x-www-form-urlencoded')
        })
    })

    test('should use application/json when posting an object', () => {
        axios.post('/foo', {})
        return getAjaxRequest().then(req => {
            expect(req.requestHeaders['Content-Type']).toEqual('application/json;charset=utf-8')
        })
    })

    test('should remove content-type if data is empty', () => {
        axios.post('/foo')
        return getAjaxRequest().then(req => {
            expect(req.requestHeaders['Content-Type']).toEqual(undefined)
        })
    })

    test('should preserve content-type if data is false', () => {
        axios.post('/foo', false)
        return getAjaxRequest().then(req => {
            expect(req.requestHeaders['Content-Type']).toEqual('application/x-www-form-urlencoded')
        })
    })

    test('should remove content-type if data is FormData', () => {
        axios.post('/foo', new FormData())
        return getAjaxRequest().then(req => {
            expect(req.requestHeaders['Content-Type']).toEqual(undefined)
        })
    })
})
