const joinMonster = require( 'join-monster' ).default
const { GraphQLSchema } = require( 'graphql' )
const { GraphQLObjectType, GraphQLList, GraphQLString, GraphQLInt } = require( 'graphql' )

const db = require( './database' )
const User = require( './User' )
const Knowledge = require( './Knowledge' )

const QueryRoot = new GraphQLObjectType({
	name: 'Query',
	fields: () => ({
		users: {
			type: new GraphQLList( User ),
			args: {
				id: { type: GraphQLString }
			},
			resolve: (parent, args, context, resolveInfo) => {
				return joinMonster( resolveInfo, {}, sql => {
					console.log( sql )
					return db.query( sql )
				})
			},
			where: (usersTable, args, context) => {
				if (args.id) {
					let userId = args.id
					let operator = '='
					if (userId[ 0 ] === '!') {
						operator = '!='
						userId = userId.slice( 1 )
					}
					return `${usersTable}.id ${operator} ${userId}`
				}
			},
		},
		knowledges: {
			type: new GraphQLList( Knowledge ),
			resolve: (parent, args, context, resolveInfo) => {
				return joinMonster( resolveInfo, {}, sql => {
					console.log( sql )
					return db.query( sql )
				})
			}
		},
	})
})

const Schema = new GraphQLSchema({
	description: 'a test schema',
	query: QueryRoot
})

module.exports = Schema