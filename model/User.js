const { GraphQLObjectType, GraphQLList, GraphQLString, GraphQLInt } = require( 'graphql' )

console.log('require Knowledge')
const {Knowledge} = require( './Knowledge' )

exports.default = new GraphQLObjectType({
	name: 'User',
	sqlTable: '"User"',
	uniqueKey: 'id',
	fields: () => ({
		id: {
			type: GraphQLInt
		},
		name: {
			type: GraphQLString,
			sqlColumn: 'name'
		},
		knowledges: {
			type: new GraphQLList( Knowledge ),
			sqlJoin: (userTable, knowledgeTable) => `${userTable}."id" = ${knowledgeTable}."idUser"`
		}
	})
})

// module.exports = User