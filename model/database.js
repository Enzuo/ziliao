const pgp = require( 'pg-promise' )()
const config = require( 'config' )

// Connection to database
const database = config.get( 'database' )
var connection = {
	host : database.host,
	user : database.user,
	password : database.password,
	database : database.name,
	port : database.port,
}
var db = pgp( connection )

module.exports = db