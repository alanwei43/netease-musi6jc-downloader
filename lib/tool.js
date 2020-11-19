const fs = require("fs");
const path = require("path");

module.exports = {
    Logger: function (log) {
        return function (...args) {
            fs.appendFile(log, `[${new Date().toLocaleString()}] ` + args.join(" ") + "\n", {
                encoding: "utf-8"
            }, () => { });
        }
    },
    downloadPath: path.resolve("music")
}