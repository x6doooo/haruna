/**
 * Created by dx.yang on 2017/8/22.
 */

const lodash = require('lodash');
const bunyan = require('bunyan');
const Stream = require('stream');


function create(name, basePath) {
    const stream = new Stream();
    stream.writable = true;
    stream.write = function(obj) {
        let file = lodash.get(obj, 'src.file') || '';
        let lineNum = lodash.get(obj, 'src.line') || '';
        if (basePath) {
            file = file.split(basePath);
        }
        file = file[file.length - 1];
        console.log(`[pid:${obj.pid} ${file}:${lineNum}]\n${obj.msg}`);
    };

    return bunyan.createLogger({
        name,
        src: true,
        streams: [{
            type: "raw",
            stream: stream,
        }],
    })
}

module.exports = {
    create
};



