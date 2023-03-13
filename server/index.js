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
const uploadsMiddleware = require('./uploads-middleware');

if (process.env.NODE_ENV === 'development') {
  app.use(require('./dev-middleware')(publicPath));
}

app.use(express.static(publicPath));
app.use(express.json());

app.get('/api/users', (req, res, next) => {
  const sql = `
    select "username"
    from   "users"
  `;
  db.query(sql)
    .then(result => {
      res.status(200).json(result.rows);
    })
    .catch(err => next(err));
});

app.get('/api/user/:username', (req, res, next) => {
  const username = String(req.params.username);

  if (!username) {
    throw new ClientError(400, 'user not found');
  }

  const sql = `
    select "userId",
           "username",
           "displayName",
           "image",
           "bio"
      from "users"
     where "username" = $1
  `;
  const params = [username];

  db.query(sql, params)
    .then(result => {
      if (!result.rows[0]) {
        throw new ClientError(404, `could not find user: ${username}`);
      }
      res.status(200).json(result.rows[0]);
    })
    .catch(err => next(err));
});

app.post('/api/auth/sign-up', async (req, res, next) => {
  const { username, password, image, bio } = req.body;

  if (!username || !password) {
    throw new ClientError(400, 'username and password are required fields');
  }

  argon2.hash(password)
    .then(hashedPassword => {
      const sql = `
        insert into "users" ("username", "hashedPassword", "image", "bio")
        values ($1, $2, $3, $4)
        returning "userId",
                  "username",
                  "displayName",
                  "image",
                  "bio",
                  "createdAt"
      `;
      const params = [username, hashedPassword, image, bio];

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

app.get('/api/user/posts/:userId', (req, res, next) => {
  const userId = Number(req.params.userId);

  if (!userId) {
    throw new ClientError(400, 'could not find user');
  }

  const sql = `
    select *
      from "posts"
     where "userId" = $1
  order by "postId" DESC
  `;
  const params = [userId];

  db.query(sql, params)
    .then(result => {
      res.json(result.rows);
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
           "image",
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

app.patch('/api/user/profile', uploadsMiddleware, (req, res, next) => {
  const { userId } = req.user;
  const { displayName, bio } = req.body;
  const image = `/images/${req.file.filename}`;

  if (!userId) {
    throw new ClientError(400, 'could not find user');
  }

  const sql = `
      update "users"
      set    "image" = $1,
             "displayName" = $2,
             "bio" = $3
       where "userId" = $4
   returning *
  `;
  const params = [image, displayName, bio, userId];

  db.query(sql, params)
    .then(result => {
      if (!result.rows[0]) {
        throw new ClientError(404, `could not find userId: ${userId}`);
      }
      res.status(200).json(result.rows[0]);
    })
    .catch(err => next(err));
});

app.patch('/api/user/profile/no-image', (req, res, next) => {
  const { userId } = req.user;
  const { displayName, bio } = req.body;

  if (!userId) {
    throw new ClientError(400, 'could not find user');
  }

  const sql = `
      update "users"
      set    "displayName" = $1,
             "bio" = $2
       where "userId" = $3
   returning *
  `;
  const params = [displayName, bio, userId];

  db.query(sql, params)
    .then(result => {
      if (!result.rows[0]) {
        throw new ClientError(404, `could not find userId: ${userId}`);
      }
      res.status(200).json(result.rows[0]);
    })
    .catch(err => next(err));
});

app.post('/api/new/post/no-image', (req, res, next) => {
  const { userId, username } = req.user;
  const { displayName, avatar, textContent } = req.body;

  if (!userId) {
    throw new ClientError(400, 'could not find user');
  }

  const sql = `
    insert into "posts" ("userId", "username", "displayName", "avatar", "textContent")
    values ($1, $2, $3, $4, $5)
    returning *
  `;
  const params = [userId, username, displayName, avatar, textContent];

  db.query(sql, params)
    .then(result => {
      res.json(result.rows[0]);
    })
    .catch(err => next(err));
});

app.post('/api/new/post', uploadsMiddleware, (req, res, next) => {
  const { userId, username } = req.user;
  const { displayName, avatar, textContent } = req.body;
  const image = `/images/${req.file.filename}`;

  if (!userId) {
    throw new ClientError(400, 'could not find user');
  }

  const sql = `
    insert into "posts" ("userId", "username", "displayName", "avatar", "textContent", "image")
    values ($1, $2, $3, $4, $5, $6)
    returning *
  `;
  const params = [userId, username, displayName, avatar, textContent, image];

  db.query(sql, params)
    .then(result => {
      res.json(result.rows[0]);
    })
    .catch(err => next(err));
});

app.delete('/api/posts/:postId', (req, res, next) => {
  const { userId } = req.user;
  const postId = Number(req.body.postId);

  if (!Number.isInteger(postId) || postId <= 0) {
    throw new ClientError(400, 'postId must be a positive integer');
  }

  const sql = `
    delete from "posts"
    where       "postId" = $1
    and         "userId" = $2
    returning   *
  `;
  const params = [postId, userId];

  db.query(sql, params)
    .then(result => {
      res.json(result.rows[0]);
    })
    .catch(err => next(err));
});

app.post('/api/likes/:postId', uploadsMiddleware, (req, res, next) => {
  const { userId } = req.user;
  const postId = Number(req.params.postId);

  if (!userId) {
    throw new ClientError(400, 'could not find user');
  }
  if (!Number.isInteger(postId) || postId <= 0) {
    throw new ClientError(400, 'postId must be a positive integer');
  }

  const sql = `
    insert into "likes" ("postId", "userId")
    values ($1, $2)
    returning *
  `;
  const params = [postId, userId];

  db.query(sql, params)
    .then(result => {
      res.json(result.rows[0]);
    })
    .catch(err => next(err));
});

app.delete('/api/likes/:postId', uploadsMiddleware, (req, res, next) => {
  const { userId } = req.user;
  const postId = Number(req.params.postId);

  if (!userId) {
    throw new ClientError(400, 'could not find user');
  }
  if (!Number.isInteger(postId) || postId <= 0) {
    throw new ClientError(400, 'postId must be a postiive integer');
  }

  const sql = `
    delete from "likes"
    where       "postId" = $1
    and         "userId" = $2
    returning   *
  `;
  const params = [postId, userId];

  db.query(sql, params)
    .then(result => {
      res.json(result.rows);
    })
    .catch(err => next(err));
});

app.get('/api/user/likes/:profileId', uploadsMiddleware, (req, res, next) => {
  const profileId = Number(req.params.profileId);

  if (!Number.isInteger(profileId) || profileId <= 0) {
    throw new ClientError(400, 'profileId must be a positive integer');
  }

  const sql = `
    select distinct "p"."postId",
                    "p"."userId",
                    "p"."displayName",
                    "p"."avatar",
                    "p"."textContent",
                    "p"."image",
                    "p"."createdAt",
                    "l"."likesId"
    from            "posts" as "p"
    join            "likes" as "l" using ("postId")
    where           "l"."userId" = $1
    and             "l"."postId" = "p"."postId"
    order by        "l"."likesId" DESC
  `;

  const params = [profileId];

  db.query(sql, params)
    .then(result => {
      res.json(result.rows);
    })
    .catch(err => next(err));
});

app.get('/api/search', uploadsMiddleware, (req, res, next) => {
  const { userId } = req.user;
  const { users } = req.query;

  if (!userId) {
    throw new ClientError(400, 'could not find user');
  }

  const sql = `
    select "userId",
           "username",
           "displayName",
           "image",
           "bio",
           "createdAt"
    from   "users"
    where  "username" like $1
  `;
  const params = [`%${users}%`];

  db.query(sql, params)
    .then(result => {
      res.json(result.rows);
    })
    .catch(err => next(err));
});

app.post('/api/follow/:profileId', (req, res, next) => {
  const { userId } = req.user;
  const profileId = Number(req.params.profileId);

  if (!userId) {
    throw new ClientError(400, 'could not find user');
  }
  if (!Number.isInteger(profileId) || profileId <= 0) {
    throw new ClientError(400, 'profileId must be a positive integer');
  }

  const sql = `
    insert into "following" ("userId", "followingId")
    values ($1, $2)
    returning *
  `;
  const params = [userId, profileId];

  db.query(sql, params)
    .then(result => {
      res.json(result.rows[0]);
    })
    .catch(err => next(err));
});

app.get('/api/user/follow/:userId', (req, res, next) => {
  const { userId } = req.user;

  const sql = `
    select "followingId"
    from   "following"
    where  "userId" = $1
  `;
  const params = [userId];

  db.query(sql, params)
    .then(result => {
      res.json(result.rows);
    })
    .catch(err => next(err));
});

app.delete('/api/follow/:profileId', (req, res, next) => {
  const { userId } = req.user;
  const profileId = Number(req.params.profileId);

  if (!userId) {
    throw new ClientError(400, 'could not find user');
  }
  if (!Number.isInteger(profileId) || profileId <= 0) {
    throw new ClientError(400, 'profileId must be a positive integer');
  }

  const sql = `
    delete from "following"
    where       "followingId" = $1
    returning   *
  `;
  const params = [profileId];

  db.query(sql, params)
    .then(result => {
      res.json(result.rows);
    })
    .catch(err => next(err));
});

app.post('/api/shares/:postId', uploadsMiddleware, (req, res, next) => {
  const { userId } = req.user;
  const postId = Number(req.params.postId);

  if (!userId) {
    throw new ClientError(400, 'could not find user');
  }
  if (!Number.isInteger(postId) || postId <= 0) {
    throw new ClientError(400, 'postId must be a positive integer');
  }

  const sql = `
    insert into "shares" ("postId", "userId")
    values ($1, $2)
    returning *
  `;
  const params = [postId, userId];

  db.query(sql, params)
    .then(result => {
      res.json(result.rows[0]);
    })
    .catch(err => next(err));
});

app.delete('/api/shares/:postId', uploadsMiddleware, (req, res, next) => {
  const { userId } = req.user;
  const postId = Number(req.params.postId);

  if (!userId) {
    throw new ClientError(400, 'could not find user');
  }
  if (!Number.isInteger(postId) || postId <= 0) {
    throw new ClientError(400, 'postId must be a postiive integer');
  }

  const sql = `
    delete from "shares"
    where       "postId" = $1
    and         "userId" = $2
    returning   *
  `;
  const params = [postId, userId];

  db.query(sql, params)
    .then(result => {
      res.json(result.rows);
    })
    .catch(err => next(err));
});

app.get('/api/user/shares/:profileId', uploadsMiddleware, (req, res, next) => {
  const profileId = Number(req.params.profileId);

  if (!Number.isInteger(profileId) || profileId <= 0) {
    throw new ClientError(400, 'profileId must be a positive integer');
  }

  const sql = `
    select distinct "p"."postId",
                    "p"."userId",
                    "p"."displayName",
                    "p"."avatar",
                    "p"."textContent",
                    "p"."image",
                    "p"."createdAt",
                    "s"."sharesId"
    from            "posts" as "p"
    join            "shares" as "s" using ("postId")
    where           "s"."userId" = $1
    and             "s"."postId" = "p"."postId"
    order by        "s"."sharesId" DESC
  `;

  const params = [profileId];

  db.query(sql, params)
    .then(result => {
      res.json(result.rows);
    })
    .catch(err => next(err));
});

app.use(errorMiddleware);

app.listen(process.env.PORT, () => {
  process.stdout.write(`\n\napp listening on port ${process.env.PORT}\n\n`);
});
