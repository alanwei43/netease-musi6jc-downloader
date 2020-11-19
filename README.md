## 使用介绍

1. 先安装信任 `cert/` 目录下的证书.
2. 安装依赖 `npm install` 并执行 `npm start`. (这一步会开启一个代理)
3. 设置浏览器代理为 `localhost:3210`
4. 访问 `https://music.163.com` 播放歌曲, 然后代理工具会自动将歌曲下载到 `music/` 目录下


## 小技巧

### 快速自动播放下一曲

在网易云音乐页面打开控制台， 贴入以下代码并回车执行:

```javascript
setInterval(() => {
    const style = document.querySelector(".cur").getAttribute("style");
    const width = parseInt((/: ?(\d+)/.exec(style) || [])[1]);
    console.log("width: ", width);
    if(isNaN(width)){
        console.warn("invalid width");
        return;
    }
    if(width >= 5) {
        console.log("next song");
        document.querySelector(".nxt").click();
    }
}, 5 * 1000);
```