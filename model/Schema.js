const joinMonster = require( 'join-monster' ).default
const { GraphQLSchema } = require( 'graphql' )
const { GraphQLObjectType, GraphQLList, GraphQLString, GraphQLInt } = require( 'graphql' )

const db = require( './database' )
const User = require( './User' )
const Knowledge = require( './Knowledge' )

const helpers = require( './helpers' )

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
					let opts = helpers.searchString( args.id )
					return `${usersTable}.id ${opts.operator} ${opts.search}`
				}
			},
		},
		knowledges: {
			type: new GraphQLList( Knowledge ),
			args: {
				search: { type: GraphQLString },
			},
			resolve: (parent, args, context, resolveInfo) => {
				return joinMonster( resolveInfo, {}, sql => {
					console.log( sql )
					return db.query( sql )
				})
			},
			where: (knowledgeTable, args, context) => {
				if (args.search) {
					return `to_tsvector(${knowledgeTable}.problem) @@  to_tsquery('${args.search}')`
				}
			},
		},
	})
})

const Schema = new GraphQLSchema({
	description: 'a test schema',
	query: QueryRoot
})

module.exports = Schema