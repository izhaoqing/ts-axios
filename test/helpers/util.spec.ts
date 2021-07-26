import {
    isDate,
    isFormData,
    isObject,
    isPlainObject,
    isURLSearchParams,
    extend,
    deepMerge
} from '../../src/helpers/utils'

describe('helpers:util', () => {
    describe('isXX', () => {
        test('should validate Date', () => {
            expect(isDate(new Date())).toBeTruthy()
            expect(isDate('')).toBeFalsy()
        })
        test('isObject', () => {
            expect(isObject({})).toBeTruthy()
            expect(isObject(new FormData())).toBeTruthy()
            expect(isObject('')).toBeFalsy()
        })
        test('isFormData', () => {
            expect(isFormData({})).toBeFalsy()
            expect(isFormData(new FormData())).toBeTruthy()
        })
        test('isURLSearchParams', () => {
            expect(isURLSearchParams('')).toBeFalsy()
            expect(isURLSearchParams(new URLSearchParams())).toBeTruthy()
        })
        test('isPlainObject', () => {
            expect(isPlainObject({})).toBeTruthy()
            expect(isPlainObject(new Date())).toBeFalsy()
        })
        test('extend', () => {
            const a = { foo: 123, bar: 456 }
            const b = { bar: 789 }
            const c = extend(a, b)
            expect(c.foo).toBe(123)
            expect(c.bar).toBe(789)
        })
        test('deepMerge', () => {
            const a = { foo: 1, bar: 2 }
            const b = { bar: 3 }
            const c = deepMerge(a, b)
            expect(c.foo).toBe(1)
            expect(c.bar).toBe(3)
            
            const d = { foo: { qux: 5 }, bar: { baz: 4 } }
            const e = { foo: { baz: 4 }, bar: { baz: 9 } }
            const f = deepMerge(null, d, e)
            expect(f).toEqual({
                foo: {
                    qux: 5,
                    baz: 4
                },
                bar: {
                    baz: 9
                }
            })
            expect(e.foo).not.toBe(f.foo)
        })
    })
})
