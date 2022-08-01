const jwt = require('jsonwebtoken'); // eslint-disable-line
const ClientError = require('./client-error'); // eslint-disable-line

// function authorizationMiddleware(req, res, next) {
//   const token = req.get('X-Access-Token');
//   if (!token) {
//     throw new ClientError(401, 'authentication required');
//   }
//   const payload = jwt.verify(token, process.env.TOKEN_SECRET);
//   req.user = payload;
//   next();
// }

function authorizationMiddleware(req, res, next) {
  const authHeader = req.headers['authorization']; // eslint-disable-line
  const token = authHeader && authHeader.split(' ')[1];
  if (token === null) return res.sendStatus(401);

  jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

module.exports = authorizationMiddleware;