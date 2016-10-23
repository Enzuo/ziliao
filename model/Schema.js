const joinMonster = require( 'join-monster' ).default
const { GraphQLSchema } = require( 'graphql' )
const { GraphQLObjectType, GraphQLList, GraphQLString, GraphQLInt } = require( 'graphql' )

const db = require( './database' )
// const User = require( './User' )
const Knowledge = require( './Knowledge' )

console.log('Knowledge', Knowledge)

const QueryRoot = new GraphQLObjectType( {
	name: 'Query',
	fields: () => ( {
		// users: {
		// 	type: new GraphQLList( User ),
		// 	resolve: ( parent, args, context, resolveInfo ) => {
		// 		return joinMonster( resolveInfo, {}, sql => {
		// 			console.log( sql )
		// 			return db.query( sql )
		// 		})
		// 	}
		// },
		// knowledges: {
		// 	type: new GraphQLList( Knowledge ),
		// 	resolve: ( parent, args, context, resolveInfo ) => {
		// 		return joinMonster( resolveInfo, {}, sql => {
		// 			console.log( sql )
		// 			return db.query( sql )
		// 		})
		// 	}
		// },
		test : {
			type: Knowledge
		}
	})
})

const Schema = new GraphQLSchema( {
	description: 'a test schema',
	query: QueryRoot
})

module.exports = Schema