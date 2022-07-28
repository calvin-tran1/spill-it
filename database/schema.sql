set client_min_messages to warning;
-- DANGER: this is NOT how to do it in the real world.
-- `drop schema` INSTANTLY ERASES EVERYTHING.
drop schema "public" cascade;
create schema "public";
CREATE TABLE "public"."users" (
    "userId" serial NOT NULL,
    "username" TEXT NOT NULL UNIQUE,
    "hashedPassword" TEXT NOT NULL,
    "displayName" TEXT,
    "avatar" TEXT,
    "bio" TEXT,
    "createdAt" timestamptz NOT NULL default now(),
    CONSTRAINT "users_pk" PRIMARY KEY ("userId")
) WITH (
  OIDS=FALSE
);
CREATE TABLE "public"."posts" (
    "postId" serial NOT NULL,
    "userId" integer NOT NULL,
    "textContent" TEXT,
    "imageUrl" TEXT,
    "createdAt" timestamptz NOT NULL default now(),
    CONSTRAINT "posts_pk" PRIMARY KEY ("postId")
) WITH (
  OIDS=FALSE
);
CREATE TABLE "public"."likes" (
    "likesId" serial NOT NULL,
    "userId" integer NOT NULL,
    "postId" integer default null,
    "reviewId" integer default null,
    "commentId" integer default null,
    CONSTRAINT "likes_pk" PRIMARY KEY ("likesId")
) WITH (
  OIDS=FALSE
);
CREATE TABLE "public"."comments" (
    "commentId" serial NOT NULL,
    "userId" integer NOT NULL,
    "textContent" TEXT,
    "imageUrl" TEXT,
    "createdAt" timestamptz NOT NULL default now(),
    CONSTRAINT "comments_pk" PRIMARY KEY ("commentId")
) WITH (
  OIDS=FALSE
);
CREATE TABLE "public"."reviews" (
    "reviewId" serial NOT NULL,
    "userId" integer NOT NULL,
    "storeName" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "rating" integer NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "review" TEXT NOT NULL,
    "createdAt" timestamptz NOT NULL default now(),
    CONSTRAINT "reviews_pk" PRIMARY KEY ("reviewId")
) WITH (
  OIDS=FALSE
);
CREATE TABLE "public"."following" (
    "followingId" integer NOT NULL,
    "userId" integer NOT NULL,
    CONSTRAINT "following_pk" PRIMARY KEY ("followingId","userId")
) WITH (
  OIDS=FALSE
);
ALTER TABLE "posts" ADD CONSTRAINT "posts_fk0" FOREIGN KEY ("userId") REFERENCES "users"("userId");
ALTER TABLE "likes" ADD CONSTRAINT "likes_fk0" FOREIGN KEY ("userId") REFERENCES "users"("userId");
ALTER TABLE "likes" ADD CONSTRAINT "likes_fk1" FOREIGN KEY ("postId") REFERENCES "posts"("postId");
ALTER TABLE "likes" ADD CONSTRAINT "likes_fk2" FOREIGN KEY ("reviewId") REFERENCES "reviews"("reviewId");
ALTER TABLE "likes" ADD CONSTRAINT "likes_fk3" FOREIGN KEY ("commentId") REFERENCES "comments"("commentId");
ALTER TABLE "comments" ADD CONSTRAINT "comments_fk0" FOREIGN KEY ("userId") REFERENCES "users"("userId");
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_fk0" FOREIGN KEY ("userId") REFERENCES "users"("userId");
ALTER TABLE "following" ADD CONSTRAINT "following_fk0" FOREIGN KEY ("followingId") REFERENCES "users"("userId");
ALTER TABLE "following" ADD CONSTRAINT "following_fk1" FOREIGN KEY ("userId") REFERENCES "users"("userId");
