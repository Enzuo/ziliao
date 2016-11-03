const helpers = {
	/**
	 * interpret search string , extract operators
	 * @param string : String
	 */ 
	searchString : function (string) {
		let search = string
		let operator = '='
		if (search[ 0 ] === '!') {
			operator = '!='
			search = search.slice( 1 )
		}
		return { operator, search }
	}
}

module.exports = helpers