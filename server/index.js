require('dotenv/config');
const path = require('path');
const express = require('express');
const errorMiddleware = require('./error-middleware');
const app = express();
const jsonMiddleware = express.json();
const publicPath = path.join(__dirname, 'public');
const ClientError = require('./client-error');
const db = require('./db');
const argon2 = require('argon2');

app.use(jsonMiddleware);

if (process.env.NODE_ENV === 'development') {
  app.use(require('./dev-middleware')(publicPath));
} else {
  app.use(express.static(publicPath));
}

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
        throw new ClientError(404, `cannot find userId: ${userId}`);
      }
      res.status(200).json(result.rows[0]);
    })
    .catch(err => next(err));
});

app.post('/api/auth/sign-up', (req, res, next) => {
  const { username, password, displayName, avatar, bio } = req.body;

  if (!username || !password || !displayName || !avatar) {
    throw new ClientError(400, 'username, password, display name, and avatar are required fields');
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
          res.status(201).json(result.rows[0]);
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

app.use(errorMiddleware);

app.listen(process.env.PORT, () => {
  process.stdout.write(`\n\napp listening on port ${process.env.PORT}\n\n`);
});
