import { createError } from '../../src/helpers/error'
import { AxiosRequestConfig, AxiosResponse } from '../../src/types'

describe('helpers:error', () => {
    test('should create an error', () => {
        const request = new XMLHttpRequest()
        const config: AxiosRequestConfig = {}
        const response: AxiosResponse = {
            status: 200,
            statusText: 'OK',
            headers: null,
            request,
            config,
            data: { foo: 'bar' }
        }
        const error = createError('Boom!', config, 'SOMETHING', request, response)
        expect(error instanceof Error).toBeTruthy()
        expect(error.message).toBe('Boom!')
        expect(error.config).toBe(config)
        expect(error.code).toBe('SOMETHING')
        expect(error.request).toBe(request)
        expect(error.response).toBe(response)
        expect(error.isAxiosError).toBeTruthy()
    })
})
