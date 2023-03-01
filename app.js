const express = require('express');
const app = express();
const requireContext = require('node-require-context')

/* 代理配置 start */
const { createProxyMiddleware } = require('http-proxy-middleware'); //引入代理模块
const proxyOptions = {
    target: 'http://test-api.hmhyg.com', //后端服务器地址
    changeOrigin: true, //处理跨域
    pathRewrite: {
        '^/Hapi': ''
    }
};
const exampleProxy = createProxyMiddleware('/Hapi', proxyOptions); //api前缀的请求都走代理
app.use(exampleProxy);
/* 代理配置 end */



// //参数‘/’可当作设置url的根显示页面，这里即”http://localhost:3000/“访问的页面设置为index.html
// app.get('/', (req, res) => {
//     res.sendFile(__dirname + "/" + "index.html")        //设置/ 下访问文件位置
// });

//读取路由
app.use(express.static('view'))
const mini_files = false //true读取子目录，false不读取子目录
const files = requireContext('./view', false, /\.html$/)
files.keys().forEach(key => {
    const index = key.lastIndexOf("\\")
    const rName = key.substring(index + 1, key.length)
    console.log("路由：" + rName)
    app.get('/' + rName, (req, res) => {
        res.sendFile(__dirname + "/" + rName) //设置/ 下访问文件位置
    });
})


//设置端口3000访问地址，即http://localhost:3000
var server = app.listen(3000, () => {
    var port = server.address().port
    console.log("访问地址http://localhost:%s", port)
})