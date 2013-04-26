var owlim = require("./drivers/owlim.js");
// http can be replaced with HTTPS
var http = require("http");
var querystring = require("querystring");

var SparqlClient = function(endpoint,path,port,driver,protocol) {
	this.driver = driver;
	this.endpoint = endpoint;
	this.path = path;
	this.port = port;
	this.namespaces = "";
	if(!protocol) this.protocol = http;
	else this.protocol = protocol; 
}
SparqlClient.prototype.addNamespaces = function(namespaces) {
	this.namespaces += namespaces;
};
SparqlClient.prototype.query = function(queryString,callback) {
	this.request(queryString,this.driver.query,callback);
};
SparqlClient.prototype.update = function(queryString,callback) {
	this.request(queryString,this.driver.update,callback);
};
SparqlClient.prototype.request = function(queryString,driver,callback) {
	var self = this;
	var r = this.protocol.request({
			host: this.endpoint,
			port: this.port,
			path: driver.getPath(this.path)+'?'+driver.getQuery(queryString),
			method: driver.method,
			headers: this.driver.headers
		}, function(res) {
			 var data = "";
			 res.on('data',
			 		function(chunk){
			 		data += chunk;
		 	  });
			 res.on('end',
			 	function () {
			 		callback(driver.formatResult(data));
			 	});
			 res.on('error',
			 	function (err) {
			 		console.log(err);
			 	})
			})
	r.end(); 
};
SparqlClient.prototype.formatResult = function(result) {
	return this.driver.format(result);
};
module.exports.Client = SparqlClient;