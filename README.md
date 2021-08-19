# ts-axios
refectory axios with ts

工程由 typescript-library-starter 创建

## webpackDevMiddleware

需要一个开发服务器，和一个接口服务器，请求还会出现跨域问题，使用 webpackDevMiddleware 可以只开一个服务器。

## Typescript

### 判断对象

判断是否是一个对象可以使用 `typeof obj === 'object'`, 时间对象，正则对象，null等都会返回 true，如果需要判断是否是一个 json 对象，可以使用 `Object.toString.call(obj) === '[object Object]'`。

```js
const isObject = obj => typeof obj === 'object' && obj !== null
const isPlainObject = obj => Object.toString.call(obj) === '[object Object]'
```

#### 声明空对象

先声明一个空对象，在给声明的对象添加属性，在 ts 中会出现错误提示。[对象字面量的惰性初始化](https://jkchao.github.io/typescript-book-chinese/tips/lazyObjectLiteralInitialization.html) 提供了几种解决方法。

```js
const foo = {}
foo.bar = 123 // Error: Property 'bar' does not exist on type '{}'
```

还可以在声明时使用 `Object.create`。

```js
const foo = Object.create(null)
```

## Ajax

### 处理body

post 请求中，传给 `send` 方法的数据可以有几种类型 [mdn-XMLHttpRequest.send()](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/send)，但是不包括 json 对象，需要转成字符串。 将 data 转成字符串后，服务端并不能正常解析数据(req.body 为 {})，因为没有正确地设置 `Content-Type = 'application/json;charset=utf-8'`。

## Jest

单元测试使用 Jest，为了测试 Ajax，使用了 jasmine-ajax 插件。

### 测试异步代码

[Testing Asynchronous Code](https://jestjs.io/docs/asynchronous)，最简单的方式是使用 `done` 回调函数，或者直接返回一个 Promise。

### Exceeded timeout

测试用例花费的时间超过默认的5s，会报错导致测试失败，需要在配置中设置超时时常。

```
thrown: "Exceeded timeout of 5000 ms for a test.
Use jest.setTimeout(newTimeout) to increase the timeout value, if this is a long-running test."
```

```js
// jest.config.js

module.exports = {
    // ...
    testTimeout: 20000
}
```

### jasmine is not defined

即使在 `test/boot.ts` 中做好配置，引入 `jasmine-ajax` 时会报错，因为在这个插件中直接使用了 `jasmine`。

```js
// test/boot.ts

const JasmineCore = require('jasmine-core')
// @ts-ignore
global.getJasmineRequireObj = function() {
  return JasmineCore
}
require('jasmine-ajax')  // ReferenceError: jasmine is not defined
```

解决方法是配置 testRunner:

```js
// jest.config.js

module.exports = {
    // ...
    testRunner: 'jest-jasmine2'
}
```

### request.responseTimeout 报错

```js
getAjaxRequest().then(request => {
    request.responseTimeout() // jasmine.clock is not a function
})
```

由于 `request.responseTimeout` 方法内部依赖了 `jasmine.clock` 方法会导致运行失败，这里我直接用了 `request.eventBus.trigger('timeout')` 方法触发了 timeout 事件。
