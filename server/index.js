require('dotenv/config');
const path = require('path');
const express = require('express');
const errorMiddleware = require('./error-middleware');
const app = express();
const publicPath = path.join(__dirname, 'public');
const ClientError = require('./client-error');
const db = require('./db');
const argon2 = require('argon2');
const jwt = require('jsonwebtoken');
const authorizationMiddleware = require('./authorization-middleware.js');

if (process.env.NODE_ENV === 'development') {
  app.use(require('./dev-middleware')(publicPath));
}

app.use(express.static(publicPath));
app.use(express.json());

app.get('/api/users', (req, res, next) => {
  const sql = `
    select "userId",
           "username",
           "displayName",
           "avatar",
           "bio"
      from "users"
  `;

  db.query(sql)
    .then(result => res.json(result.rows))
    .catch(err => next(err));
});

app.get('/api/users/:userId', (req, res, next) => {
  const userId = Number(req.params.userId);

  if (!userId) {
    throw new ClientError(400, 'userId must be a positive integer');
  }

  const sql = `
    select "userId",
           "username",
           "displayName",
           "avatar",
           "bio"
      from "users"
     where "userId" = $1
  `;
  const params = [userId];

  db.query(sql, params)
    .then(result => {
      if (!result.rows[0]) {
        throw new ClientError(404, `could not find userId: ${userId}`);
      }
      res.status(200).json(result.rows[0]);
    })
    .catch(err => next(err));
});

app.post('/api/auth/sign-up', async (req, res, next) => {
  const { username, password, displayName, avatar, bio } = req.body;

  if (!username || !password) {
    throw new ClientError(400, 'username and password are required fields');
  }

  argon2.hash(password)
    .then(hashedPassword => {
      const sql = `
        insert into "users" ("username", "hashedPassword", "displayName", "avatar", "bio")
        values ($1, $2, $3, $4, $5)
        returning "userId",
                  "username",
                  "displayName",
                  "avatar",
                  "bio",
                  "createdAt"
      `;
      const params = [username, hashedPassword, displayName, avatar, bio];

      db.query(sql, params)
        .then(result => {
          const [user] = result.rows;
          const { userId } = user;
          const payload = { userId, username };
          const token = jwt.sign(payload, process.env.TOKEN_SECRET);

          res.status(201).json({ token, user: payload });
        })
        .catch(err => {
          console.error(err);
          res.status(500).json({ error: 'an unexpected error has occurred' });
        });
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'an unexpected error has occurred' });
    });
});

app.post('/api/auth/sign-in', (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password) {
    throw new ClientError(401, 'invalid login');
  }

  const sql = `
    select "userId",
           "hashedPassword"
      from "users"
     where "username" = $1
  `;
  const params = [username];

  db.query(sql, params)
    .then(result => {
      const [user] = result.rows;
      if (!user) {
        throw new ClientError(401, 'invalid username or password');
      }

      const { userId, hashedPassword } = user;

      return argon2
        .verify(hashedPassword, password)
        .then(match => {
          if (!match) {
            throw new ClientError(401, 'invalid username or password');
          }

          const payload = { userId, username };
          const token = jwt.sign(payload, process.env.TOKEN_SECRET);

          res.json({ token, user: payload });
        });
    })
    .catch(err => next(err));
});

app.use(authorizationMiddleware);

app.get('/api/user', (req, res, next) => {
  const { userId } = req.user;
  if (!userId) {
    throw new ClientError(400, 'userId must be a positive integer');
  }

  const sql = `
    select "userId",
           "username",
           "displayName",
           "avatar",
           "bio"
      from "users"
     where "userId" = $1
  `;
  const params = [userId];

  db.query(sql, params)
    .then(result => {
      if (!result.rows[0]) {
        throw new ClientError(404, `could not find userId: ${userId}`);
      }
      res.json(result.rows[0]);
    })
    .catch(err => next(err));
});

// app.put('/api/posts', (req, res, next) => {
//   const userId = Number(req.params.userId);

//   if (!userId) {
//     throw new ClientError(400, 'userId must be a positive integer');
//   }

//   const sql = `
//     insert into "users" ("displayName", "avatar", "bio")
//     values ($1, $2, $3)
//     returning "displayName",
//               "avatar",
//               "bio"
//   `;
//   const params = [userId];

//   db.query(sql, params)
//     .then(result => {
//       if (!result.rows[0]) {
//         throw new ClientError(404, `could not find userId: ${userId}`);
//       }
//       res.status(200).json(result.rows[0]);
//     })
//     .catch(err => next(err));
// });

app.use(errorMiddleware);

app.listen(process.env.PORT, () => {
  process.stdout.write(`\n\napp listening on port ${process.env.PORT}\n\n`);
});
