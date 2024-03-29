const express = require('express')
const bodyParser = require('body-parser')
const webpack = require('webpack')
const webpackDevMiddleware = require('webpack-dev-middleware')
const webpackHotMiddleware = require('webpack-hot-middleware')
const WebpackConfig = require('./webpack.config')
const atob = require('atob')

const app = express()
const compiler = webpack(WebpackConfig)

app.use(webpackDevMiddleware(compiler, {
    publicPath: '/__build__/',
    stats: {
        colors: true,
        chunks: false
    }
}))

app.use(webpackHotMiddleware(compiler))
app.use(express.static(__dirname))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

const router = express.Router()

router.get('/simple/get', function(req, res) {
    res.json(req.query)
})

router.post('/base/post', function(req, res) {
    res.json(req.body)
})

router.post('/base/buffer', (req, res) => {
    const msg = []
    req.on('data', (chunk) => {
        chunk && msg.push(chunk)
    })
    req.on('end', () => {
        const buf = Buffer.concat(msg)
        res.json(buf.toJSON())
    })
})

router.get('/error/get', (req, res) => {
    if (Math.random() > 0.5) {
        res.json({
            msg: 'hello world'
        })
    } else {
        res.status(500)
        res.end()
    }
})

router.get('/error/timeout', (req, res) => {
    setTimeout(() => {
        res.json({
            msg: 'hello world'
        })
    }, 3000)
})

router.get('/extend/get', (req, res) => {
    res.json({
        msg: 'hello world'
    })
})

router.get('/interceptor/get', (req, res) => {
    res.json({
        msg: 'hello'
    })
})

router.post('/config/post', (req, res) => {
    res.json({
        msg: 'hello'
    })
})

router.post('/base/auth', (req, res) => {
    const auth = req.headers.authorization
    const [type, credentials] = auth.split(' ')
    console.log(atob(credentials))
    const [username, password] = atob(credentials).split(':')
    if (type === 'Basic' && username === 'Yee' && password === '123456') {
        res.json(req.body)
    } else {
        res.end('UnAuthorization')
    }
})

app.use(router)

const port = process.env.PORT || 8010
module.exports = app.listen(port, () => {
    console.log(`Server listening on http://localhost:${port}, Ctrl+C to stop\n`)
})
