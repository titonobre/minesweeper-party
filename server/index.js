'use strict';
process.env.TS_NODE_CACHE_DIRECTORY = 'cache'
process.env.TS_NODE_PROJECT = __dirname + '/tsconfig.json';

require('ts-node/register');
require('./server.ts');
