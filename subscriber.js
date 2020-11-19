const downloader = require("./lib/downloader");

module.exports = downloader;


/**
 *

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

 *
 */