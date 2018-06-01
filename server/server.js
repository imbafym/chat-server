// import express from 'express'
// import utils from 'utility'
// import bodyParser from 'body-parser'
// import cookieParser from 'cookie-parser'
// import path from 'path'
// import model from './moudle'
// import staticPath from '../build/asset-manifest.json'

var express = require('express');
var utility = require('utility');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var path = require('path');
var model = require('./moudle');
// var assetManifest = require('../build/asset-manifest.json');



// console.log(staticPath)
//后端css hock
// import csshook from 'css-modules-require-hook/preset'
// import assetHook from 'asset-require-hook'
// var preset = require('css-modules-require-hook/preset');
// var assetRequireHook = require('asset-require-hook');
// assetHook({
//     extensions: ['png'],
//     limit: 8000
// })

//後端裏面的前端渲染引入
//React => div
// var react = require('react');
// var { renderToNodeStream } = require('react-dom/server');
// var { createStore, applyMiddleware, compose } = require('redux');

// var thunk = require('redux-thunk');
// var { Provider } = require('react-redux');

// var { StaticRouter } = require('react-router-dom');
// var App = require('../src/App');
// var reducers = require('../src/reducer');

///////////////////////////
// import React from 'react'
// import { renderToNodeStream } from 'react-dom/server'
// import { createStore, applyMiddleware, compose } from 'redux'
// import thunk from 'redux-thunk'
// import { Provider } from 'react-redux'
// import { StaticRouter } from 'react-router-dom'
// import App from '../src/App'
// import reducers from '../src/reducer'

// function App() {
//     return (<div>

//         <p>Windwos</p>
//         <p>Render</p>

//     </div>)
// }
// console.log(renderToString(App()))
const Chat = model.getModel('chat')
// console.log(Chat)

const app = express()

//work with express
const server = require('http').Server(app)

const io = require('socket.io')(server)

//监听事件
io.on('connection', function (socket) {
    // console.log('user login')
    socket.on('sendmsg', function (data) {
        // console.log(data)
        const { from, to, msg } = data
        const chatid = [from, to].sort().join('_')

        Chat.create({ chatid, from, to, content: msg }, function (err, doc) {

            io.emit('recvmsg', Object.assign({}, doc))
        })
        // io.emit('recvmsg', data)
    })
})

const userRouter = require('./user')


app.use(cookieParser())
app.use(bodyParser.json())
app.use('/user', userRouter)
//拦截 user 开头或者static 路径下 执行下一步操作 一般是接受发送获取消息的路径
//否则执行index.html文件 交给前端渲染
app.use(function (req, res, next) {
    if (req.url.startsWith('/user/') || req.url.startsWith('/static/'))
        return next()


    //SSR
    // const store = createStore(
    //     reducers,
    //     compose(applyMiddleware(thunk))
    // )
    //simple seo
    // const obj = {
    //     '/msg': 'this is msg page',
    //     '/boss': 'this is boss page',
    //     '/login': 'this is login page',
    // }

    // res.write(`<!DOCTYPE html>
    // <html lang="en">
    
    // <head>
    //   <meta charset="utf-8">
    //   <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    //   <meta name="theme-color" content="#000000">
    //   <meta name='keyword' content='React,Redux,Chat, SSR'>
    //   <meta name='auther' content='Yiming Fan'>
    //   <meta name='description' content='${obj[req.url]}'>
      
    //   <title>Career Chat</title>
    //   <link rel="stylesheet" href="/${staticPath['main.css']}">
    // </head>
    
    // <body>
    //   <noscript>
    //     You need to enable JavaScript to run this app.
    //   </noscript>
    //   <div id="root">`)
    //SSR
    // let context = {}
    // const markupStream = renderToNodeStream((<Provider store={store}>
    //     <StaticRouter
    //         location={req.url}
    //         context={context}>
    //         <App />

    //     </StaticRouter>
    // </Provider>))

    // markupStream.pipe(res, { end: false })
    // markupStream.on('end', () => {
    //     res.write(
    //         `</div>
    
    //          <script src=${staticPath['main.js']} ></script>
    //        </body>
           
    //        </html>`
    //     )
    //     res.end()
    // })
    //SSR
    // const pageHtml = `<!DOCTYPE html>
    // <html lang="en">

    // <head>
    //   <meta charset="utf-8">
    //   <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    //   <meta name="theme-color" content="#000000">
    //   <meta name='keyword' content='React,Redux,Chat, SSR'>
    //   <meta name='auther' content='Yiming Fan'>
    //   <meta name='description' content='${obj[req.url]}'>

    //   <title>Career Chat</title>
    //   <link rel="stylesheet" href="/${staticPath['main.css']}">
    // </head>

    // <body>
    //   <noscript>
    //     You need to enable JavaScript to run this app.
    //   </noscript>
    //   <div id="root">${markup}</div>

    //   <script src=${staticPath['main.js']} ></script>
    // </body>

    // </html>`



    //SSR
    // res.send(pageHtml)
    return res.sendFile(path.resolve('build/index.html'))
}

)
//拦截
app.use('/', express.static(path.resolve('build')))


//项目上线
//1. 购买域名
//2. DNS 解析服务器IP
//3. 安装nginx
// 4. 使用pm2管理Node进程
// server.listen(9093, function () {
//     console.log('Node app runs on 9093')
// })


//Heroku 
const port = process.env.PORT || 3000
server.listen(port, function () {
    console.log(`Server listening on port ${port}`)
})