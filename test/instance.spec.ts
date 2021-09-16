import axios, { AxiosRequestConfig, AxiosResponse } from '../src/index'
import { getAjaxRequest } from './helper'

describe('instance', () => {
    beforeEach(() => {
        jasmine.Ajax.install()
    })

    afterEach(() => {
        jasmine.Ajax.uninstall()
    })

    test('should make a http request without verb helper', () => {
        const instance = axios.create()
        instance('/foo')

        return getAjaxRequest().then(req => {
            expect(req.url).toBe('/foo')
        })
    })

    test('should make a http request', () => {
        const instance = axios.create()
        instance.get('/foo')

        return getAjaxRequest().then(req => {
            expect(req.method).toBe('GET')
            expect(req.url).toBe('/foo')
        })
    })

    test('should make a post request', () => {
        const instance = axios.create()
        instance.post('/foo')

        return getAjaxRequest().then(req => {
            expect(req.method).toBe('POST')
        })
    })

    test('should make a delete request', () => {
        const instance = axios.create()
        instance.delete('/foo')

        return getAjaxRequest().then(req => {
            expect(req.method).toBe('DELETE')
        })
    })

    test('should make a head request', () => {
        const instance = axios.create()
        instance.head('/foo')

        return getAjaxRequest().then(req => {
            expect(req.method).toBe('HEAD')
        })
    })

    test('should make a put request', () => {
        const instance = axios.create()
        instance.put('/foo')

        return getAjaxRequest().then(req => {
            expect(req.method).toBe('PUT')
        })
    })

    test('should make a patch request', () => {
        const instance = axios.create()
        instance.patch('/foo')

        return getAjaxRequest().then(req => {
            expect(req.method).toBe('PATCH')
        })
    })

    test('should make a options request', () => {
        const instance = axios.create()
        instance.options('/foo')

        return getAjaxRequest().then(req => {
            expect(req.method).toBe('OPTIONS')
        })
    })

    test('should use instance options', () => {
        const instance = axios.create({ timeout: 2000 })
        instance.delete('/foo')

        return getAjaxRequest().then(req => {
            expect(req.timeout).toBe(2000)
        })
    })

    test('should have default headers', () => {
        const instance = axios.create({ baseURL: 'https://api.example.com' })
        
        expect(typeof instance.defaults.headers).toBe('object')
        expect(typeof instance.defaults.headers.common).toBe('object')
    })

    test('should have interceptors on the instance', done => {
        axios.interceptors.request.use(config => {
            config.withCredentials = true
            return config
        })

        const instance = axios.create()
        instance.interceptors.request.use(config => {
            config.timeout = 2000
            return config
        })

        instance.get('/foo').then((res: AxiosResponse) => {
            expect(res.config.timeout).toBe(2000)
            expect(res.config.withCredentials).toBe(undefined)
            done()
        })

        return getAjaxRequest().then(req => {
            req.respondWith({
                status: 200
            })
        })
    })

    test('should get the computed uri', () => {
        const config: AxiosRequestConfig = {
            baseURL: 'https://www.baidu.com/',
            url: '/user/12345',
            params: {
                idClient: 1,
                idTest: 2,
                testString: 'thisIsATest'
            }
        }
        expect(axios.getUri(config)).toBe('https://www.baidu.com/user/12345?idClient=1&idTest=2&testString=thisIsATest')
    })
})
