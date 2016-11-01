const { GraphQLObjectType, GraphQLList, GraphQLString, GraphQLInt } = require( 'graphql' )
const { forwardConnectionArgs, connectionDefinitions } = require( 'graphql-relay' )

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
	let { Knowledge } = require( './Knowledge' )
	return new GraphQLList( Knowledge )
}

const { connectionType: UserConnection } = connectionDefinitions({ nodeType: User })


module.exports = { User, UserConnection }