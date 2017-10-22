var querystring = require("querystring");
module.exports = {
	update : {
		headers : 	{
	        'content-type':'application/x-turtle',
	        'accept':'*/*'
		},
		method : "post",
		getPath : function(path,query) {
			return path + "/statements"
		},
		getQuery : function(query) {
			return querystring.stringify({
				"timeout" 		: 5,
				"debug" 		: "on",
				"update"		: query
			}).replace("'",'%27');
		},
		formatResult : function (resultString) {
 			if(resultString != "")  return { update :  { error : resultString, message : "sqarql update error"}};
 			else return {update : "ok"};
		}
	},
	query : {
		headers : 	{
			'content-type' : 'x-www-form-urlencoded',
	        'accept':'application/sparql-results+json'
	 	},
		method : "get",
		getPath : function(path,query) {
			return path+"?"+query;
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
				return {error : resultString, message : "Query Sqarql: JSON result parse error"};
			}
		}
	}
}
