/**
 * Created by dx.yang on 21/09/2017.
 */


const yaml = require('js-yaml');
const fs = require('fs');

function parse(configFilePath) {
    let confContent;
    try {
        confContent = yaml.safeLoad(fs.readFileSync(configFilePath))
    } catch(e) {
        throw(e)
    }
    return confContent
}

module.exports = {
    parse
};