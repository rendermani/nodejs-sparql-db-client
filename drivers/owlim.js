var querystring = require("querystring");
module.exports = {
	headers : 	{
	        'content-type':'application/x-www-form-urlencoded' ,
	        'accept':'application/sparql-results+json'
	 },
	update : {
		method : "post",
		getPath : function(path) {
			return path + "/statements"
		},
		getQuery : function(query) {
			return querystring.stringify({
				"format" 	: "application/json",
				"timeout" 	: 0,
				"debug" 	: "on",
				"update"		: query
			});
		},
		formatResult : function (resultString) {
 			return { update: resultString};
		}
	},
	query : {
		method : "post",
		getPath : function(path) {
			return path;
		},
		getQuery : function(query) {
			return querystring.stringify({
				"format" 	: "application/json",
				"timeout" 	: 0,
				"debug" 	: "on",
				"query"		: query
			});
		},
		formatResult : function (resultString) {
			try {
				var result = JSON.parse(resultString);	
				return result.results.bindings;
			} catch (err) {
				return {error : resultString};
			}
		}
	}
}