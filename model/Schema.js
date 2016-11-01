const joinMonster = require( 'join-monster' ).default
const { GraphQLSchema } = require( 'graphql' )
const { GraphQLObjectType, GraphQLList, GraphQLString, GraphQLInt } = require( 'graphql' )

const db = require( './database' )
const { User } = require( './User' )
const { Knowledge, KnowledgeConnection } = require( './Knowledge' )

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
			type: KnowledgeConnection,
			args: {
				search: { type: GraphQLString },
				first: { type: GraphQLInt },
			},
			sqlPaginate: true,
			sortKey: {
        		order: 'desc',
        		key: [ 'dateUpdated', 'id' ]
      		},
			resolve: (parent, args, context, resolveInfo) => {
				// console.log("resolve", resolveInfo, args)
				return joinMonster( resolveInfo, {}, sql => {
					console.log( sql )
					return db.query( sql )
				}, { dialect : 'pg' })
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