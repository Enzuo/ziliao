var express = require('express');
var graphqlHTTP = require('express-graphql');
var { buildSchema } = require('graphql');

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

// The root provides a resolver function for each API endpoint
var root = {
  knowledges: () => {
    return [{ id: 1, problem: 'Hello', solution: 'World', author :{id:1, name:'pop'} }];
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