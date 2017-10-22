var sparql = require("sparql-db-client");
var driver = sparql.owlim;
var SparqlClient = require ("sparql-db-client").Client; 


var name = "Pussy";
var uri = "<urn:test:"+name.toLowerCase()+">";
var host = "tomcat.cloudya.de";
var path = "/openrdf-sesame/repositories/spinner";
var port = 8881

sparqlClient = new SparqlClient(host,path,port,driver);
sparqlClient.update("insert { "+uri+" <urn:test:name> '"+name+"' }  where { optional{ "+uri+" <urn:test:name> ?x } }",console.log); 
sparqlClient.query("select  ?name where {?s <urn:test:name> ?name}",console.log);