const { GraphQLObjectType, GraphQLList, GraphQLString, GraphQLInt } = require( 'graphql' )

console.log('require User')
const User = require( './User' ).instance
console.log("user", User)

exports.default = new GraphQLObjectType({
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

// module.exports = Knowledge