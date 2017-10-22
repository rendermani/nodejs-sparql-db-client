var owlim = require("./drivers/owlim.js");
// http can be replaced with HTTPS
var https = require("https");
var http = require("http");
var querystring = require("querystring");

var SparqlClient = function(config) {
	this.config = config;
	this.namespaces = "";
	if (!config.protocol) {
		this.protocol = https;
	} else this.protocol = config.protocol;
}
SparqlClient.prototype.addNamespace = function(ns,prefix) {
	this.namespaces += 'PREFIX '+prefix+':<'+ns+'> ';
};
SparqlClient.prototype.query = function(queryString,callback) {
	this.request(queryString,this.config.driver.query,callback);
};
SparqlClient.prototype.update = function(queryString,callback) {
	this.request(queryString,this.config.driver.update,callback);
};
SparqlClient.prototype.request = function(queryString,driver,callback) {
	var self = this;
	var startTime = new Date().getTime();
	var fullQuery = driver.getQuery(this.namespaces + queryString);
	var r = http.request({
		                              host: this.config.host,
		                              port: this.config.port,
		                              path: driver.getPath(this.config.path,fullQuery),
		                              method: driver.method,
		                              headers: driver.headers,
		                              auth : this.config.auth
	                              }, function(res) {
		//console.log("headers res: ", res.headers);
		//console.log("statusCode: ", res.statusCode);
		var data = "";
		res.on('data',
		       function(chunk){
			       data += chunk;
		       });
		res.on('end',
		       function () {
			        callback(driver.formatResult(data), queryString,
			                {
				                executionTime : new Date().getTime() - startTime
			                });
		       });
		res.on('error',
		       function (err) {
			       console.log("error", err);
			       callback({error:err,message : "connection-error"},queryString);
		       })
	})
    r.on('error', function(e) {
        console.log("problem with request:",e);
});
	//console.log("'"+fullQuery+"'");
	if(driver.method.toLowerCase()=="post") r.end(queryString,'utf8');
	else r.end();
};
SparqlClient.prototype.formatResult = function(result) {
	return this.config.driver.format(result);
};
module.exports.Client = SparqlClient;