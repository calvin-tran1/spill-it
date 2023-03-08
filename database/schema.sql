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
    "image" TEXT,
    "bio" TEXT,
    "createdAt" timestamptz NOT NULL default now(),
    CONSTRAINT "users_pk" PRIMARY KEY ("userId")
) WITH (
  OIDS=FALSE
);
CREATE TABLE "public"."posts" (
    "postId" serial NOT NULL,
    "userId" integer NOT NULL,
    "username" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "avatar" TEXT NOT NULL,
    "textContent" TEXT,
    "image" TEXT,
    "createdAt" timestamptz NOT NULL default now(),
    CONSTRAINT "posts_pk" PRIMARY KEY ("postId")
) WITH (
  OIDS=FALSE
);
CREATE TABLE "public"."likes" (
    "likesId" serial NOT NULL,
    "userId" integer NOT NULL,
    "postId" integer default null,
    CONSTRAINT "likes_pk" PRIMARY KEY ("likesId")
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
CREATE TABLE "public"."shares" (
	"sharesId" serial NOT NULL,
	"userId" integer NOT NULL,
	"postId" integer NOT NULL,
	CONSTRAINT "shares_pk" PRIMARY KEY ("sharesId")
) WITH (
  OIDS=FALSE
);
ALTER TABLE "posts" ADD CONSTRAINT "posts_fk0" FOREIGN KEY ("userId") REFERENCES "users"("userId");
ALTER TABLE "posts" ADD CONSTRAINT "posts_fk1" FOREIGN KEY ("username") REFERENCES "users"("username");
ALTER TABLE "posts" ADD CONSTRAINT "posts_fk2" FOREIGN KEY ("displayName") REFERENCES "users"("displayName");
ALTER TABLE "posts" ADD CONSTRAINT "posts_fk3" FOREIGN KEY ("avatar") REFERENCES "users"("image");
ALTER TABLE "likes" ADD CONSTRAINT "likes_fk0" FOREIGN KEY ("userId") REFERENCES "users"("userId");
ALTER TABLE "likes" ADD CONSTRAINT "likes_fk1" FOREIGN KEY ("postId") REFERENCES "posts"("postId");
ALTER TABLE "following" ADD CONSTRAINT "following_fk0" FOREIGN KEY ("followingId") REFERENCES "users"("userId");
ALTER TABLE "following" ADD CONSTRAINT "following_fk1" FOREIGN KEY ("userId") REFERENCES "users"("userId");
ALTER TABLE "shares" ADD CONSTRAINT "shares_fk0" FOREIGN KEY ("userId") REFERENCES "users"("userId");
ALTER TABLE "shares" ADD CONSTRAINT "shares_fk1" FOREIGN KEY ("postId") REFERENCES "posts"("postId");
