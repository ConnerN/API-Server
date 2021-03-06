const express = require('express');
const morgan = require('morgan');
const redis = require('redis');

const api = require('./api');

const app = express();
const port = process.env.PORT || 8000;

const redisClient = redis.createClient(
  process.env.REDIS_PORT || '6379',
  process.env.REDIS_HOST || 'localhost'
);

const { connectToDB } = require('./lib/mongo');

const rateLimitWindowMS = 40000;
const rateLimitMaxRequests = 10;
/*
 * Morgan is a popular logger. I did it!
 */
app.use(morgan('dev'));

app.use(express.json());
app.use(express.static('public'));

function getUserTokenBucket(ip) {
  return new Promise((resolve, reject) => {
    redisClient.hgetall(ip, (err, tokenBucket) => {
      if (err) {
        reject(err);
      } else if (tokenBucket) {
        tokenBucket.tokens = parseFloat(tokenBucket.tokens);
        resolve(tokenBucket);
      } else {
        resolve({
          tokens: rateLimitMaxRequests,
          last: Date.now()
        });
      }
    });
  });
}

function saveUserTokenBucket(ip, tokenBucket) {
  return new Promise((resolve, reject) => {
    redisClient.hmset(ip, tokenBucket, (err, resp) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

async function rateLimit(req, res, next) {
  try {
    const tokenBucket = await getUserTokenBucket(req.ip);

    const currentTimestamp = Date.now();
    const ellapsedTime = currentTimestamp - tokenBucket.last;
    tokenBucket.tokens += ellapsedTime *
      (rateLimitMaxRequests / rateLimitWindowMS);
    tokenBucket.tokens = Math.min(
      tokenBucket.tokens,
      rateLimitMaxRequests
    );
    tokenBucket.last = currentTimestamp;

    if (tokenBucket.tokens >= 1) {
      tokenBucket.tokens -= 1;
      await saveUserTokenBucket(req.ip, tokenBucket);
      next();
    } else {
      res.status(429).send({
        error: "request over limit, please try again later"
      });
    }
  } catch (err) {
    next();
  }
}

app.use(rateLimit);
/*
 * All routes for the API are written in modules in the api/ directory.  The
 * top-level router lives in api/index.js.  That's what we include here, and
 * it provides all of the routes.
 */
app.use('/', api);

app.use('*', function (req, res, next) {
  res.status(404).json({
    error: "Requested resource " + req.originalUrl + " does not exist"
  });
});

connectToDB(() => {
  app.listen(port, function() {
    console.log("== Final Server is running on port", port);
  });
});
