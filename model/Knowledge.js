'use strict'

const { GraphQLObjectType, GraphQLList, GraphQLString, GraphQLInt } = require( 'graphql' )

const User = require( './User' )

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
			sqlJoin: (knowledgeTable, authorTable) => `${knowledgeTable}."idAuthor" = ${authorTable}."id"`
		}
	})
})

module.exports = Knowledge