var pgp = require( 'pg-promise' )()
var config = require( 'config' )
var express = require( 'express' )
var treeize = require( 'treeize' )
var graphqlHTTP = require( 'express-graphql' )
var { buildSchema } = require( 'graphql' )

// Connection to database
var database = config.get( 'database' )
var connection = {
  host : database.host,
  user : database.user,
  password : database.password,
  database : database.name,
  port : database.port,
}
var db = pgp( connection )


// Construct a schema, using GraphQL schema language
var schema = buildSchema(`
  type Query {
    knowledges(about : String) : [Knowledge]
  }

  type Knowledge {
    id : Int
    problem : String
    solution : String
    author : User
  }

  type User {
    id : Int
    name : String 
  }

  schema {
    query : Query
  }
`);

//Queries
var knowledgesQuery = `
  SELECT 
     "Knowledge"."id"
    ,"Knowledge"."problem"
    ,"Knowledge"."solution"
    ,"User"."id" AS "author:id"
    ,"User"."name" AS "author:name"
  FROM "Knowledge"
  INNER JOIN "User_Knowledge" ON "Knowledge"."id" = "User_Knowledge"."idKnowledge" 
  INNER JOIN "User"           ON "User"."id"      = "User_Knowledge"."idUser" 
`

var tree = new treeize()

// The root provides a resolver function for each API endpoint
var root = {
  knowledges: () => {
    return db.query( knowledgesQuery ).then( data => tree.grow( data ).getData() )
  },
};

var app = express();
app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
}));
app.listen(4000);
console.log('Running a GraphQL API server at localhost:4000/graphql');