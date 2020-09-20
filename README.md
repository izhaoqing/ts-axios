# ts-axios
refectory axios with ts

工程由 typescript-library-starter 创建

### 判断对象

判断是否是一个对象可以使用 `typeof obj === 'object'`, 时间对象，正则对象，null等都会返回 true，如果需要判断是否是一个 json 对象，可以使用 `Object.toString.call(obj) === '[object Object]'`。

```js
const isObject = obj => typeof obj === 'object' && obj !== null
const isPlainObject = obj => Object.toString.call(obj) === '[object Object]'
```

### 处理body

post 请求中，传给 `send` 方法的数据可以有几种类型 [mdn-XMLHttpRequest.send()](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/send)，但是不包括 josn 对象，需要转成字符串。 将 data 转成字符串后，服务端并不能正常解析数据(req.body 为 {})，因为没有正确地设置 `Content-Type = 'application/json;charset=utf-8'`。
