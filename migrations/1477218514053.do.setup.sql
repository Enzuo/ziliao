/* setup base schema */
CREATE TABLE "Knowledge" (
    "id"       SERIAL PRIMARY KEY
  , "problem"  TEXT   NOT NULL 
  , "solution" TEXT   NOT NULL 
);

CREATE TABLE "User" (
    "id"   SERIAL PRIMARY KEY
  , "name" VARCHAR(50)
);

CREATE TABLE "User_Knowledge" (
    "idKnowledge" INT REFERENCES "Knowledge" ("id")
  , "idUser"      INT REFERENCES "User" ("id")
  , PRIMARY KEY ("idKnowledge", "idUser")
);
