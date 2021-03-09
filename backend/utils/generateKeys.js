const crypto = require('crypto');

const SESSION_SECRET = crypto.randomBytes(256).toString('hex');
const MONGO_STORE_SECRET = crypto.randomBytes(256).toString('hex');

console.table({ SESSION_SECRET, MONGO_STORE_SECRET });
