import axios from '../src/index'
import { getAjaxRequest } from './helper'

describe('progress', () => {
    beforeEach(() => {
        jasmine.Ajax.install()
    })

    afterEach(() => {
        jasmine.Ajax.uninstall()
    })

    test('should add a download progress handler', () => {
        const progressSpy = jest.fn()

        axios('/foo', {
            onDownloadProgress: progressSpy
        })

        getAjaxRequest().then(req => {
            req.respondWith({
                status: 200,
                responseText: '{"foo": "bar"}'
            })
            expect(progressSpy).toHaveBeenCalled()
        })
    })

    test('should add a upload progress handler', () => {
        const progressSpy = jest.fn()

        axios('/foo', {
            onUploadProgress: progressSpy
        })

        getAjaxRequest().then(req => {
            req.respondWith({
                status: 200,
                responseText: '{"foo": "bar"}'
            })
            expect(progressSpy).toHaveBeenCalled()
        })
    })
})
