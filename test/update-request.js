var request = require('request');
var querystring = require('querystring');
var fs = require('fs');
var driver = require("sparql-db-client").owlim;
var Client = require("sparql-db-client").Client;
var http = require("http");

var namespaces = "PREFIX rdfs:<http://www.w3.org/2000/01/rdf-schema#> \n  PREFIX owl:<http://www.w3.org/2002/07/owl#> \n  PREFIX xsd:<http://www.w3.org/2001/XMLSchema#> \n PREFIX rdf:<http://www.w3.org/1999/02/22-rdf-syntax-ns#> \n PREFIX s:<http://cloudya.net/spinner#> \n ";

function testQuery (query,cb) {
  var uri = "http://localhost:8888/openrdf-sesame/repositories/spinner/statements";
  var queryObj = {
        "format"    : "application/json",
        "timeout"     : 0,
        "debug"     : "on",
        "update"    : namespaces + query
  };
  var callback = function(e,r,body) {
    if (e) return cb(e,r,body)
    else if(r && r.statusCode == 400) return cb(body,r,false);
    else if(r && r.statusCode == 200) return cb(false,r,JSON.parse(body).results.bindings);
    else if(r && r.statusCode == 204) return cb(false,r,"update ok");
    else return cb(body,r,false);
  };
  var opts = {
      uri : uri,
      headers: {
            'content-type':'application/x-www-form-urlencoded',
            'accept':'application/sparql-results+json'
      }
  }
  request.post(opts,callback).form(queryObj);
}

fs.readFile("flasche.sparql",function(err,fileQuery) {
  testQuery(fileQuery.toString(),function(e,r,body) {
      if(e) console.log("error",e);
      else console.log(body);
  });
})
console.log(new Date());



// var readQuery = "SELECT  ?label WHERE {?uri rdfs:label ?label}";
// client.query(readQuery, function(results,query,stats) {
//   console.log(stats);
//   results.forEach(function(result) {console.log(result.label.value)});
// })
