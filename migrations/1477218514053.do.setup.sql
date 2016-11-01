/* setup base schema */
CREATE TABLE "User" (
    "id"   SERIAL PRIMARY KEY
  , "name" VARCHAR(50)
);

CREATE TABLE "Knowledge" (
    "id"          SERIAL PRIMARY KEY
  , "problem"     TEXT   NOT NULL 
  , "solution"    TEXT   NOT NULL 
  , "idAuthor"    INT REFERENCES "User" ("id")
  , "dateCreated" DATE DEFAULT CURRENT_DATE
  , "dateUpdated" DATE DEFAULT CURRENT_DATE
);