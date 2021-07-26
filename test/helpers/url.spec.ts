import { buildURL, isAbsoluteURL, isURLSameOrigin } from '../../src/helpers/url'

describe('helpers:url', () => {
    describe('buildURL', () => {
        test('should support null params', () => {
            expect(buildURL('/foo')).toBe('/foo')
        })
        test('should support params', () => {
            expect(buildURL('/foo', { foo: 'bar' })).toBe('/foo?foo=bar')
        })
        test('should ignore if some params value is null', () => {
            expect(buildURL('/foo', { foo: 'bar', baz: null })).toBe('/foo?foo=bar')
        })
        test('should support object params', () => {
            expect(buildURL('/foo', { foo: { bar: 'baz' } })).toBe('/foo?foo=' + encodeURI('{"bar":"baz"}'))
        })
        test('should support date params', () => {
            const date = new Date();
            expect(buildURL('/foo', { date })).toBe('/foo?date=' + date.toISOString())
        })
        test('should support array params', () => {
            expect(buildURL('/foo', {
                foo: ['bar', 'baz']
            })).toBe('/foo?foo[]=bar&foo[]=baz')
        })
        test('should support special char params', () => {
            expect(buildURL('/foo', { foo: '@:$, '})).toBe('/foo?foo=@:$,+')
        })
        test('should support existing params', () => {
            expect(
                buildURL('/foo?foo=bar', {
                    bar: 'baz'
                })
            ).toBe('/foo?foo=bar&bar=baz')
        })
        test('should correct discard url hash mark', () => {
            expect(
                buildURL('/foo?foo=bar#hash', {
                    query: 'baz'
                })
            ).toBe('/foo?foo=bar&query=baz')
        })
        test('should use serializer if provided', () => {
            const fn = jest.fn(() => {
                return 'foo=bar'
            })
            const params = { foo: 'bar' }
            expect(buildURL('/foo', params, fn)).toBe('/foo?foo=bar')
        })
        test('should support URLSearchParams', () => {
            expect(buildURL('/foo', new URLSearchParams('bar=baz'))).toBe('/foo?bar=baz')
        })
    })

    describe('isAbsoluteURL', function () {
        it('should return true if URL begins with valid scheme name', function () {
            expect(isAbsoluteURL('https://api.github.com/users')).toBe(true);
            expect(isAbsoluteURL('custom-scheme-v1.0://example.com/')).toBe(true);
            expect(isAbsoluteURL('HTTP://example.com/')).toBe(true);
        });
        it('should return false if URL begins with invalid scheme name', function () {
            expect(isAbsoluteURL('123://example.com/')).toBe(false);
            expect(isAbsoluteURL('!valid://example.com/')).toBe(false);
        });
        it('should return true if URL is protocol-relative', function () {
            expect(isAbsoluteURL('//example.com/')).toBe(true);
        });
        it('should return false if URL is relative', function () {
            expect(isAbsoluteURL('/foo')).toBe(false);
            expect(isAbsoluteURL('foo')).toBe(false);
        });
    });

    describe('isURLSameOrigin', () => {
        test('should detect same origin', () => {
            expect(isURLSameOrigin(window.location.href)).toBeTruthy()
        })
        test('should detect different origin', () => {
            expect(isURLSameOrigin('https://github.com')).toBeFalsy()
        })
    })
})
