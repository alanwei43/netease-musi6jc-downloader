const fetch = require("node-fetch");
const util = require('util');
const fs = require('fs');
const path = require("path");
const cheerio = require("cheerio");
const { Logger, downloadPath } = require("./tool")
const Hash = require("@js-core/node-io-library/dist/library/hash")

const completedDir = "completed";
const pipe = util.promisify(require('stream').pipeline);

const logger = Logger("complete-info.log");

function getSongName(id) {
    logger(`准备获取音乐 ${id} 的标题`);
    return fetch(`https://music.163.com/song?id=${id}`)
        .then(res => res.text())
        .then(html => cheerio.load(html))
        .then($ => ($("title").text().split(" - ")[0] || "").trim());
}
function copyMusic(file) {
    const ext = path.extname(file);
    const id = path.basename(file).split(".")[0];
    logger(`处理 ${file} 文件名称, 音乐Id: ${id}, 文件扩展名: ${ext}`);
    return getSongName(id).then(title => {
        if (title === "网易云音乐") {
            logger(`${file} 获取音乐标题失败: ${title}`);
            return "fail";
        }

        const target = path.join(completedDir, title + ext);
        if (fs.existsSync(target)) {
            return Hash.hashFile(file).then(hashVal => path.join(completedDir, `${title} [${hashVal}]${ext}`));
        }
        return target;

    }).then(target => {
        logger(`[准备] ${file} 复制到 ${target}`);
        return pipe(fs.createReadStream(file), fs.createWriteStream(target)).then(() => {
            logger(`[完成] ${file} 复制到 ${target}`);
            return "ok";
        }).catch(err => {
            logger(`[失败] ${file} 复制到 ${target}: ${err}`);
            return "fail";
        });
    }).catch(err => {
        logger(`${file} 获取音乐标题异常 ${err}`);
        return "fail";
    });
}

if (!fs.existsSync(completedDir)) {
    fs.mkdirSync(completedDir);
}

fs.readdirSync(downloadPath)
    .reduce((prev, name) => prev.then(() => copyMusic(path.join(downloadPath, name))), Promise.resolve())
    .then(() => process.exit());

