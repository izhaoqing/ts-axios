import axios, { AxiosResponse, AxiosTransformer } from '../src/index'
import { getAjaxRequest } from './helper'

describe('transform', () => {
    beforeEach(() => {
        jasmine.Ajax.install()
    })
    afterEach(() => {
        jasmine.Ajax.uninstall()
    })

    test('should transform JSON to string', () => {
        const data = {
            foo: 'bar'
        }
        axios.post('/foo', data)
        return getAjaxRequest().then(req => {
            expect(req.params).toBe('{"foo":"bar"}')
        })
    })

    test('should transform JSON to string', done => {
        axios.get('/foo').then(res => {
            expect(typeof res.data).toBe('object')
            expect(res.data.foo).toBe('bar')
            done()
        })
        getAjaxRequest().then(req => {
            req.respondWith({
                status: 200,
                responseText: '{"foo":"bar"}'
            })
        })
    })

    test('should override default transform', () => {
        axios.post('/foo', { foo: 'bar' }, {
            transformRequest(data) {
                return data;
            }
        })

        return getAjaxRequest().then(req => {
            expect(req.params).toEqual({ foo: 'bar' })
        })
    })

    test('should allow an Array of transformers', () => {
        axios.post('/foo', { foo: 'bar' }, {
            transformRequest: (axios.defaults.transformRequest as AxiosTransformer[]).concat(function(data) {
                return data.replace('bar', 'baz')
            })
        })

        return getAjaxRequest().then(req => {
            expect(req.params).toBe('{"foo":"baz"}')
        })
    })

    test('should allowing mutating headers', () => {
        const token = Math.floor(Math.random() * Math.pow(2, 64)).toString(36)
        axios('/foo', {
            transformRequest(data, headers) {
                headers['X-Authorization'] = token
                return data
            }
        })
        
        return getAjaxRequest().then(req => {
            expect(req.requestHeaders['X-Authorization']).toBe(token)
        })
    })
})
