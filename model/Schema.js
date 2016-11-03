const joinMonster = require( 'join-monster' ).default
const { GraphQLSchema } = require( 'graphql' )
const { GraphQLObjectType, GraphQLList, GraphQLString, GraphQLInt, GraphQLNonNull } = require( 'graphql' )

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
        		key: ['dateUpdated', 'id']
      		},
			resolve: (parent, args, context, resolveInfo) => {
				// console.log("resolve", resolveInfo, args)
				console.log("resolve")
				joinMonster( resolveInfo, {}, sql => {
					console.log( sql )
					return db.query( sql )
				}, { dialect : 'pg' })
			},
			where: (knowledgeTable, args, context) => {
				console.log('where')
				if (args.search) {
					return `to_tsvector(${knowledgeTable}.problem) @@  to_tsquery('${args.search}')`
				}
			},
		},
	})
})

var count = 0

const MutationRoot = new GraphQLObjectType({
	name: 'RootMutationType',
	fields: {
		addKnowledge: {
			type: Knowledge,
			description: 'Create a new Knowledge',
			args: {
				problem: { type: new GraphQLNonNull( GraphQLString )},
				solution: { type: new GraphQLNonNull( GraphQLString )},
				idAuthor: { type: new GraphQLNonNull( GraphQLInt )}
			},
			resolve: function (parent, args, context, resolveInfo) {
				
				return db.query(
					`INSERT INTO "Knowledge" 
					("problem", "solution", "idAuthor") VALUES 
					( $1, $2, $3 ) 
					RETURNING "id"`
					, [args.problem, args.solution, args.idAuthor])
				.then( (data) => {
					if (data.length < 1) throw 'err'
					var updateContext =  { id : data[0].id }
					return joinMonster( resolveInfo, updateContext, sql => {
						console.log( sql )
						return db.query( sql )
					})
				})
			},
			where: (knowledgeTable, args, context) => {
				var _id = context.id
				if (_id) {
					return `${knowledgeTable}."id" = ${_id}`
				}
			},
		}
	}
})

const Schema = new GraphQLSchema({
	description: 'a test schema',
	query: QueryRoot,
	mutation: MutationRoot,
})

module.exports = Schema