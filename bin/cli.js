#!/usr/bin/env node
'use strict'

const fs = require( 'fs' )
const args = require( 'args' )
const chalk = require( 'chalk' )
const config = require( 'config' )
const promptly = require( 'promptly' )
const postgrator = require( 'postgrator' )

const info = chalk.blue.bold
const error = chalk.red.bold
const success = chalk.green.bold
const migrationsDir = './migrations'

args.command( 'migrate', 'Migrate the database (up,down,create)', (name, sub, opts) => {

	const database = config.get( 'database' )
	postgrator.setConfig({
		migrationDirectory: migrationsDir,
		schemaTable: 'schemaversion',
		driver: 'pg',
		host: database.host,
		port: database.port,
		database: database.name,
		username: database.user,
		password: database.password
	})

	var subcommand = sub[ 0 ]
	switch (true) {
		case /^\d+$/.test( subcommand ):
			console.log( info( 'migrating base to version', subcommand ))
			getDatabaseVersions().then( (versions) => {
				return promptly.confirm( `Migrate from ${versions.current} to ${subcommand} ? (y/n)` )
			}).then( (shouldContinue) => {
				doMigration( subcommand, shouldContinue )
			}).catch( (err) => {
				console.log( error( err ))
			})
			break

		case subcommand === 'create':
			promptly.prompt( 'Migration title :', { 
				validator : titleValidator 
			}).then( (title) => {	
				return promptly.prompt( 'Decription :' ).then( (description) => {
					return { description, title }
				})
			}).then( (infos) => {
				let stamp = (new Date).getTime()
				Promise.all([
					writeFile( `${migrationsDir}/${stamp}.do.${infos.title}.sql`, `/* ${infos.description} */` ),
				    writeFile( `${migrationsDir}/${stamp}.undo.${infos.title}.sql`, `/* ${infos.description} */` )
				]).then( (paths) => {
					console.log( paths )
				}).catch( (err) => {
					console.log( error( err ))
				})
			}).catch( (err) => {
				console.log( error( err ))
			})
			break

		default:
			console.log( info( 'migrating base to last version' ))
			getDatabaseVersions().then( (versions) => {
				return promptly.confirm( `Migrate from ${versions.current} to ${versions.max} ? (y/n)` )
			}).then( (shouldContinue) => {
				doMigration( 'max', shouldContinue )
			}).catch( (err) => {
				console.log( error( err ))
			})
	}
})

const flags = args.parse( process.argv );
if (Object.keys( flags ).length !== 0) {
	args.showHelp()
}


/***************************************
 * Private helper functions
 ***************************************/

/**
 * return versions { current, max }
 */
function getDatabaseVersions () {
	return new Promise( (resolve, reject) => {
		postgrator.getVersions( (err, versions) => {
			if (err) {
				return reject( err )
			}
			resolve( versions )
		})
	})
}

function endConnection (msg) {
	postgrator.endConnection(() => {
		console.log( msg )
	})
}

function titleValidator (title) {
	if (title.length > 15) {
		throw new Error( 'The title is too long' )
	}
	if (!/^\w+$/.test( title )) {
		throw new Error( 'The title contains special characters' )
	}
	return title
}

/**
 * execute the migration or abort them
 * end the migration process
 */
function doMigration (target, execute) {
	if (execute) {
		postgrator.migrate( target , (err) => {
			if (err) {
				endConnection( error( err ))
			}
			else {
				endConnection( success( 'Database migrated' ))
			}
		})
	}
	else {
		endConnection( error( 'Migration aborted' ))
	}
}

/**
 * fs.writeFile modified to return a promise
 */
function writeFile (path, content) {
	return new Promise( (resolve, reject) => {
		fs.writeFile( path, content, (err) => {
			if (err) {
				return reject( err )
			}
			resolve( path )
		})
	})
}