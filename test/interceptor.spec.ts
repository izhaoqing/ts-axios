import axios, { AxiosRequestConfig, AxiosResponse } from '../src/index'
import { getAjaxRequest } from './helper'

describe('interceptors', () => {
    beforeEach(() => {
        jasmine.Ajax.install()
    })
    afterEach(() => {
        jasmine.Ajax.uninstall()
    })

    test('should add a request interceptor', () => {
        const instance = axios.create()
        instance.interceptors.request.use((config: AxiosRequestConfig) => {
            config.headers.test = 'added by interceptor'
            return config
        })

        instance('/foo')
        return getAjaxRequest().then(req => {
            expect(req.requestHeaders.test).toBe('added by interceptor')
        })
    })

    test('should add a request interceptor that returns a new config object', () => {
        const instance = axios.create()
        instance.interceptors.request.use(() => {
            return {
                url: '/foo',
                method: 'post'
            }
        })

        instance('/bar')
        return getAjaxRequest().then(req => {
            expect(req.url).toBe('/foo')
            expect(req.method).toBe('POST')
        })
    })

    test('should add a request interceptor that returns a promise', (done) => {
        const instance = axios.create()
        instance.interceptors.request.use((config: AxiosRequestConfig) => {
            return new Promise(res => {
                setTimeout(() => {
                    config.headers.async = 'promise'
                    res(config)
                }, 10)
            })
        })

        instance('/foo')
        setTimeout(() => {
            getAjaxRequest().then(req => {
                expect(req.requestHeaders.async).toBe('promise')
                done()
            })
        }, 100)
    })

    test('should add multiple request interceptors', () => {
        const instance = axios.create()
        instance.interceptors.request.use(config => {
            config.headers.test1 = '1'
            return config
        })
        instance.interceptors.request.use(config => {
            config.headers.test2 = '2'
            return config
        })
        instance.interceptors.request.use(config => {
            config.headers.test3 = '3'
            return config
        })

        instance('/foo')
        return getAjaxRequest().then(request => {
            expect(request.requestHeaders.test1).toBe('1')
            expect(request.requestHeaders.test2).toBe('2')
            expect(request.requestHeaders.test3).toBe('3')
        })
    })

    test('should add a response interceptor', (done) => {
        const instance = axios.create()
        instance.interceptors.response.use((response: AxiosResponse) => {
            response.data = response.data + ' - modified by interceptor'
            return response
        })

        instance('/foo').then(res => {
            expect(res.data).toBe('OK - modified by interceptor')
            done()
        })
        getAjaxRequest().then(req => {
            req.respondWith({
                status: 200,
                responseText: 'OK'
            })
        })
    })

    test('should add a response interceptor that returns a new object', done => {
        const instance = axios.create()
        instance.interceptors.response.use(() => {
            return {
                data: 'stuff',
                status: 500,
                statusText: 'ERR',
                request: null,
                headers: null,
                config: {}
            }
        })

        instance('/foo').then(response => {
            expect(response.data).toBe('stuff')
            expect(response.headers).toBeNull()
            expect(response.status).toBe(500)
            expect(response.statusText).toBe('ERR')
            expect(response.request).toBeNull()
            expect(response.config).toEqual({})
            done()
        })
        getAjaxRequest().then(req => {
            req.respondWith({
                status: 200,
                responseText: 'OK'
            })
        })
    })

    test('should add a response interceptor that returns a promise', done => {
        const instance = axios.create()
        instance.interceptors.response.use(data => {
            return new Promise(resolve => {
                // do something async
                setTimeout(() => {
                    data.data = 'you have been promised!'
                    resolve(data)
                }, 10)
            })
        })

        instance('/foo').then(res => {
            expect(res.data).toBe('you have been promised!')
            done()
        })
        getAjaxRequest().then(request => {
            request.respondWith({
                status: 200,
                responseText: 'OK'
            })
        })
    })

    test('should add multiple response interceptor', done => {
        const instance = axios.create()
        instance.interceptors.response.use(res => {
            res.data = res.data + '1'
            return res
        })
        instance.interceptors.response.use(res => {
            res.data = res.data + '2'
            return res
        })
        instance.interceptors.response.use(res => {
            res.data = res.data + '3'
            return res
        })

        instance('/foo').then(res => {
            expect(res.data).toBe('OK123')
            done()
        })
        getAjaxRequest().then(request => {
            request.respondWith({
                status: 200,
                responseText: 'OK'
            })
        })
    })

    test('should allow removing interceptors', done => {
        const instance = axios.create()

        instance.interceptors.response.use(res => {
            res.data = res.data + '1'
            return res
        })
        const intercept = instance.interceptors.response.use(res => {
            res.data = res.data + '2'
            return res
        })
        instance.interceptors.response.use(data => {
            data.data = data.data + '3'
            return data
        })
        instance.interceptors.response.eject(intercept)
        instance.interceptors.response.eject(5)

        instance('/foo').then(res => {
            expect(res.data).toBe('OK13')
            done()
        })
        getAjaxRequest().then(request => {
            request.respondWith({
                status: 200,
                responseText: 'OK'
            })
        })
    })
})
