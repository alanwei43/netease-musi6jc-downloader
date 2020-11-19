const fetch = require("node-fetch");
const util = require('util');
const fs = require('fs');
const path = require("path");
const { Logger, downloadPath } = require("./tool")

const pipe = util.promisify(require('stream').pipeline);

const logger = Logger("subscriber.log");

module.exports = function ({ req, res }) {
    if (req.fullUrl.includes("/weapi/song/enhance/player/url/v1")) {
        const json = Buffer.from(res.body.base64, 'base64').toString('utf-8')
        const { data } = JSON.parse(json);
        data.forEach(item => downloadMusic(`${item.id}.${item.type.toLocaleLowerCase()}`, item.url));
    }
};

if (!fs.existsSync(downloadPath)) {
    fs.mkdirSync(downloadPath);
}
async function downloadMusic(fileName, url) {
    const filePath = path.join(downloadPath, fileName);
    if (fs.existsSync(filePath)) {
        logger(`${filePath} existed`);
        return;
    }
    logger(`${filePath} ready download`);
    const response = await fetch(url);
    if (response.ok) {
        await pipe(response.body, fs.createWriteStream(filePath));
        logger(`${filePath} download complete`);
    }
}
