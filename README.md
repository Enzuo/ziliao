Knowledge storage server experiment using GraphQL and PostgresSQL

### Requirements :
- Node
- PostgresSQL

### Running the server : 
- Create a postgres database
- Copy `config/default.toml` to `config/dev.toml` and change the values to use your database
- Run the install `npm run migrate`
- Run the server `npm run debug`
- Access the graphQL api at the address [http://localhost:4000/graphql]()