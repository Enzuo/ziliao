const { GraphQLObjectType, GraphQLList, GraphQLString, GraphQLInt } = require( 'graphql' )


const User = new GraphQLObjectType({
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
			type: knowledgeList(),
			sqlJoin: (userTable, knowledgeTable) => `${userTable}."id" = ${knowledgeTable}."idAuthor"`
		}
	})
})

//for circular dependancy
function knowledgeList () {
	let Knowledge = require( './Knowledge' )
	return new GraphQLList( Knowledge )
}

module.exports = User