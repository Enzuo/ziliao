'use strict'

const { GraphQLObjectType, GraphQLList, GraphQLString, GraphQLInt } = require( 'graphql' )

const User = require( './User' )

const helpers = require( './helpers' )

const Knowledge = new GraphQLObjectType({
	name: 'Knowledge',
	sqlTable: '"Knowledge"',
	uniqueKey: 'id',
	fields: () => ({
		id: {
			type: GraphQLInt
		},
		problem: {
			type: GraphQLString,
			sqlColumn: 'problem'
		},
		solution: {
			type: GraphQLString,
			sqlColumn: 'solution'
		},
		author: {
			type: User,
			args: {
				id: { type: GraphQLString },
			},
			sqlJoin: (knowledgeTable, authorTable) => `${knowledgeTable}."idAuthor" = ${authorTable}."id"`,
			where: (usersTable, args, context) => {
				if (args.id) {
					let opts = helpers.searchString( args.id )
					return `${usersTable}.id ${opts.operator} ${opts.search}`
				}
			}
		},
	})
})

module.exports = Knowledge