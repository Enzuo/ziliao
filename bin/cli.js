#!/usr/bin/env node
'use strict'

const fs = require( 'fs' )
const args = require( 'args' )
const chalk = require( 'chalk' )
const config = require( 'config' )
const promptly = require( 'promptly' )
const Postgrator = require( 'postgrator' )

const info = chalk.blue.bold
const error = chalk.red.bold
const success = chalk.green.bold
const migrationsDir = './migrations'

args.command( 'migrate', 'Migrate the database (up,down,create)', (name, sub, opts) => {

	const database = config.get( 'database' )
	const postgrator = new Postgrator({
		migrationDirectory: migrationsDir,
		schemaTable: 'public.schemaversion',
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
		postgrator.getDatabaseVersion().then( (version) => {
			return promptly.confirm( `Migrate from ${version} to ${subcommand} ? (y/n)` )
		}).then( (shouldContinue) => {
			if (shouldContinue) {
				postgrator.migrate( subcommand ).then()
					.then( appliedMigrations => console.log( appliedMigrations ))
					.catch( error => console.log( error ))
			}
		}).catch( (err) => {
			console.log( error( err ))
			postgrator.migrate().then()
				.then( appliedMigrations => console.log( appliedMigrations ))
  			.catch( error => console.log( error ))
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
		var maxVersion
		postgrator
			.getMaxVersion()
			.then( version => maxVersion = version )
		postgrator.getDatabaseVersion().then( (version) => {
			return promptly.confirm( `Migrate from ${version} to ${maxVersion} ? (y/n)` )
		}).then( (shouldContinue) => {
			if (shouldContinue) {
				postgrator.migrate().then()
					.then( appliedMigrations => console.log( appliedMigrations ))
					.catch( error => console.log( error ))
			}
		}).catch( (err) => {
			console.log( error( err ))
			postgrator.migrate().then()
				.then( appliedMigrations => console.log( appliedMigrations ))
				.catch( error => console.log( error ))
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

function endConnection (msg) {
	// postgrator.endConnection(() => {
		console.log( msg )
	// })
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