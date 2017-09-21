/**
 * Created by dx.yang on 21/09/2017.
 */

const mysql = require('mysql');
const lodash = require('lodash');

const defaultConfig = {
    connectionLimit : 0
};

class Pool {
    constructor(cfg, logger) {
        cfg = lodash.assign({}, defaultConfig, cfg);

        if (!logger) {
            logger = {
                info(...args) {
                    console.log.apply(console, args);
                }
            };
        }
        this.logger = logger;

        this.pool = mysql.createPool(cfg);

        this.pool.on('acquire', connection => {
            this.logger.info('Connection %d acquired', connection.threadId);
        });

        this.pool.on('enqueue', () => {
            this.logger.info('Waiting for available connection slot');
        });

        this.pool.on('release', connection => {
            this.logger.info('Connection %d released', connection.threadId);
        });

        this.pool.end(err => {
            this.logger.info('all connections in the pool have ended', err);
        });
    }

    query(...args) {
        return new Promise((resolve, reject) => {
            args.push((err, results, fields) => {
                if (err) {
                    reject(err);
                } else {
                    resolve({
                        results,
                        fields
                    });
                }
            });
            this.pool.query.apply(this.pool, args);
        });
    }

}

function create(cfg, logger) {
    return new Pool(cfg, logger);
}


module.exports = {
    create
};
