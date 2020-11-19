const fs = require("fs");
const path = require("path");
const util = require("util");
const { Logger } = require("./tool")

const logger = Logger("convert.log");
const pipe = util.promisify(require('stream').pipeline);

(function (dir, target) {
    if (!target) {
        target = dir;
    }
    fs.readdirSync(dir).reduce((prev, name) => {
        return prev.then(() => {
            const reg = /^(\[[a-z0-9]{32}\]) (.+)(\..+)$/g;
            const source = path.join(dir, name);
            if (reg.test(name)) {
                const newName = name.replace(reg, "$2 $1$3");
                logger(`源名: ${name}, 目标名: ${newName}`);
                const targetFile = path.join(target, newName);
                return pipe(fs.createReadStream(source), fs.createWriteStream(targetFile));
            }
            if (/^([^\[]+) (\[[a-z0-9]{32}\])(\..+)$/g.test(name)) {
                logger("准备删除文件: ", name);
                // fs.unlinkSync(source);
            }
            return Promise.resolve();
        });
    }, Promise.resolve()).then(() => process.exit());
})("/data/alan/Music", "logs");