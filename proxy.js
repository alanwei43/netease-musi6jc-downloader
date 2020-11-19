const w2 = require("@js-core/whistle/index");
const fetch = require("node-fetch");
const fs = require("fs");

const path = require('path');

if (!fs.existsSync("storage")) {
    fs.mkdirSync("storage");
}

const PORT = 3210;
w2({
    'port': PORT,
    'baseDir': path.join(__dirname, 'storage'),
    'copy': true,
    'certDir': path.join(__dirname, 'cert')
}, function () {
    console.log(`代理启动成功, 代理地址为: http://localhost:${PORT}`);

    // 开启 HTTPS 抓包
    fetch(`http://localhost:${PORT}/cgi-bin/intercept-https-connects`, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: "clientId=1605798976870-0&interceptHttpsConnects=1"
    }).then(response => response.json()).then(response => {
        console.log(`HTTPS请求抓取开启状态: ${JSON.stringify(response)}`);
    }).catch(err => {
        console.log("HTTPS请求抓取开启失败: ", err);
    });
});
