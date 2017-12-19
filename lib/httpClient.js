/**
 * Created by dx.yang on 2017/4/29.
 */


const request = require('request');
const lodash = require('lodash');
const randomUseragent = require('random-useragent');

const defaultConfig = {
    timeout: 5000,
    pool: {
        maxSockets: Infinity
    }
};

class HTTPClient {
    constructor(config) {
        let defaultConfigClone = lodash.cloneDeep(defaultConfig);
        this.config = Object.assign(defaultConfigClone, config);
        this.client = request.defaults(this.config);
        this.debug = true;
    }
    requestWithRandomUA(requestConfig) {
        requestConfig.headers = requestConfig.headers || {};
        requestConfig.headers['User-Agent'] = randomUseragent.getRandom();
        return this.request(requestConfig);
    }
    request(requestConfig) {
        return new Promise((resolve, reject) => {
            this.client(requestConfig, (err, response, body) => {
                if (err) {
                    if (requestConfig.retry) {
                        console.log('request error:', err);
                        console.log('request retry!');
                        this.client(requestConfig, (err, response, body) => {
                            if (err) {
                                reject(err);
                                return;
                            }
                            resolve({
                                response,
                                body
                            });
                        });
                    } else {
                        reject(err);
                        return
                    }
                }
                resolve({
                    response,
                    body
                })
            });
        })
    }
}

function create(cfg) {
    return new HTTPClient(cfg);
}

module.exports = {
    create
};

