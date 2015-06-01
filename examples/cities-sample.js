var iris = require("../");
var config = require("./config");

iris.Client.globalOptions.apiEndPoint = config.apiEndPoint;
iris.Client.globalOptions.accountId = config.accountId;
iris.Client.globalOptions.userName = config.userName;
iris.Client.globalOptions.password = config.password;

if(process.argv.length < 3){
  console.log("usage: node cities-sample [stateAbbreviation] e.g. node cities-sample NC");
  process.exit(1);
}

var state = process.argv[2];
iris.City.list({"available":true, "state":state}, function(err,list){
  console.log("Cities for selected state: " + JSON.stringify(list, null, 2));
});