var request = require('request');
var querystring = require('querystring');
var fs = require('fs');
var driver = require("sparql-db-client").owlim;
var Client = require("sparql-db-client").Client;
var http = require("http");

var namespaces = "PREFIX rdfs:<http://www.w3.org/2000/01/rdf-schema#> \n  PREFIX owl:<http://www.w3.org/2002/07/owl#> \n  PREFIX xsd:<http://www.w3.org/2001/XMLSchema#> \n PREFIX rdf:<http://www.w3.org/1999/02/22-rdf-syntax-ns#> \n PREFIX s:<http://cloudya.net/spinner#> \n ";
console.log("start");
var config = {
  host : "192.168.0.20",
  path : "/openrdf-sesame/repositories/spinner",
  port : 8888,
  driver : driver,
  protocol : http
}
console.log(new Date());
var client = new Client(config);
client.addNamespaces(namespaces);
var readQuery = "SELECT  ?label WHERE {?uri rdfs:label ?label}";
client.query(readQuery, function(results,query,stats) {
      console.log(stats);
      results.forEach(function(result) {console.log(result.label.value)});
})



