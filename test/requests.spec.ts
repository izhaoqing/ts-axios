import axios, { AxiosResponse, AxiosError } from '../src/index'
import { getAjaxRequest } from './helper'

describe('requests', () => {
    beforeEach(() => {
        jasmine.Ajax.install()
    })

    afterEach(() => {
        jasmine.Ajax.uninstall()
    })

    test('should treat single string arg as url', () => {
        axios('/foo')
        return getAjaxRequest().then(request => {
            expect(request.url).toBe('/foo')
            expect(request.method).toBe('GET')
        })
    })

    test('should treat method value as lowercase string', () => {
        axios({
            url: '/foo',
            method: 'POST'
        }).then(res => {
            expect(res.config.method).toBe('post')
        })
        return getAjaxRequest().then(request => {
            request.respondWith({
                status: 200
            })
        })
    })

    test('should reject on network errors', done => {
        const resolveSpy = jest.fn((res: AxiosResponse) => res)
        const rejectSpy = jest.fn((e: AxiosError) => e)

        jasmine.Ajax.uninstall()

        axios.get('/foo').then(resolveSpy, rejectSpy).then(next, next)

        function next(res: AxiosResponse | AxiosError) {
            expect(resolveSpy).not.toHaveBeenCalled()
            expect(rejectSpy).toHaveBeenCalled()
            expect(res instanceof Error).toBeTruthy()
            expect((res as AxiosError).message).toBe('Network Error')
            // expect(res.request).toEqual(expect.any(XMLHttpRequest))

            jasmine.Ajax.install()
            done()
        }
    })
    
    test('should reject on timeout', done => {
        axios('/foo', {
            timeout: 2000,
            method: 'post'
        }).catch(err => {
            expect(err instanceof Error).toBeTruthy()
            expect(err.message).toBe('Timeout of 2000 ms exceeded')
            done()
        })

        getAjaxRequest().then(request => {
            // @ts-ignore
            request.eventBus.trigger('timeout')
        })
    })

    test('should reject when validateStatus returns false', done => {
        const resolveSpy = jest.fn((res: AxiosResponse) => res)
        const rejectSpy = jest.fn((e: AxiosError) => e)

        axios.get('/foo', {
            validateStatus(status) {
                return status !== 500
            }
        }).then(resolveSpy, rejectSpy).then(next, next)

        getAjaxRequest().then(req => {
            req.respondWith({
                status: 500
            })
        })

        function next(res: AxiosResponse | AxiosError) {
            expect(resolveSpy).not.toHaveBeenCalled()
            expect(rejectSpy).toHaveBeenCalled()
            expect(res instanceof Error).toBeTruthy()
            expect((res as AxiosError).message).toBe('Request failed with status code 500')
            expect((res as AxiosError).response!.status).toBe(500)
            done()
        }
    })

    test('should return JSON when resolved', done => {
        axios.post('/foo', {
            auth: {
                username: '',
                password: ''
            },
            headers: {
                Accept: 'application/json'
            }
        }).then(res => {
            expect(res.data).toEqual({ a: 1 })
            done()
        })

        getAjaxRequest().then(req => {
            req.respondWith({
                status: 200,
                statusText: 'OK',
                responseText: '{"a": 1}'
            })
        })
    })

    test('should return JSON when rejecting', done => {
        axios.post('/foo', {
            auth: {
                username: '',
                password: ''
            },
            headers: {
                Accept: 'application/json'
            }
        }).catch(e => {
            expect(typeof e.response.data).toBe('object')
            expect(e.response.data.error).toBe('BAD USERNAME')
            expect(e.response.data.code).toBe(1)
            done()
        })

        getAjaxRequest().then(req => {
            req.respondWith({
                status: 400,
                statusText: 'Bad Request',
                responseText: '{"error": "BAD USERNAME", "code": 1}'
            })
        })
    })

    test('should supply correct response', done => {
        axios.post('/foo').then(res => {
            expect(res.data.foo).toBe('bar')
            expect(res.status).toBe(200)
            expect(res.statusText).toBe('OK')
            expect(res.headers['content-type']).toBe('application/json')
            done()
        })

        getAjaxRequest().then(req => {
            req.respondWith({
                status: 200,
                statusText: 'OK',
                responseText: '{"foo": "bar"}',
                responseHeaders: {
                    'Content-Type': 'application/json'
                }
            })
        })
    })

    test('should allow overriding Content-Type header case-insensitive', done => {
        axios({
            method: 'post',
            data: {},
            headers: {
                'Content-Type': 'application/json'
            }
        })

        getAjaxRequest().then(req => {
            expect(req.requestHeaders['Content-Type']).toBe('application/json')
            done()
        })
    })

    test('should support array buffer response', done => {
        function str2ab(str: string) {
            const buff = new ArrayBuffer(str.length * 2)
            const view = new Uint16Array(buff)
            for (let i = 0; i < str.length; i++) {
                view[i] = str.charCodeAt(i)
            }
            return buff
        }

        axios.get('/foo', {
            responseType: 'arraybuffer'
        }).then(res => {
            expect(res.data.byteLength).toBe(22)
            done()
        })

        getAjaxRequest().then(req => {
            req.respondWith({
                status: 200,
                // @ts-ignore
                response: str2ab('Hello world')
            })
        })
    })
})
