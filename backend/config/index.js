const assert = require('assert');

const {
  PRODUCTION_HOST,
  DEVELOPMENT_HOST,
  PRODUCTION_ORIGIN,
  DEVELOPMENT_ORIGIN,
  SESSION_SECRET,
  MONGO_STORE_SECRET,
} = process.env;

const production = process.env.NODE_ENV === 'production';

const config = {};

config.production = production;

if (production) {
  assert(PRODUCTION_HOST, 'PRODUCTION_HOST is required!');
  assert(PRODUCTION_ORIGIN, 'PRODUCTION_ORIGIN is required!');

  config.host = PRODUCTION_HOST;
  config.origin = PRODUCTION_ORIGIN;
} else {
  assert(DEVELOPMENT_HOST, 'DEVELOPMENT_HOST is required!');
  assert(DEVELOPMENT_ORIGIN, 'DEVELOPMENT_ORIGIN is required!');

  config.host = DEVELOPMENT_HOST;
  config.origin = DEVELOPMENT_ORIGIN;
}

assert(SESSION_SECRET, 'SESSION_SECRET is required!');
assert(MONGO_STORE_SECRET, 'MONGO_STORE_SECRET is required!');

config.corsOptions = {
  origin: config.origin,
  methods: 'GET,POST,PATCH,DELETE',
  credentials: true,
  optionsSuccessStatus: 200,
};

config.sessionOptions = {
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1 * 60 * 60 * 3600,
    httpOnly: true,
    secure: production,
  },
};

config.mongoStoreSecret = MONGO_STORE_SECRET;

config.mongooseOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
};

module.exports = config;
