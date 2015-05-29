var iris = require("../");
var config = require("./config");

iris.Client.globalOptions.apiEndPoint = config.apiEndPoint;
iris.Client.globalOptions.accountId = config.accountId;
iris.Client.globalOptions.userName = config.userName;
iris.Client.globalOptions.password = config.password;

if(process.argv.length < 3){
  console.log("usage: node rateCenters [stateAbbreviation] e.g. node rateCenters NC");
  process.exit(1);
}

var state = process.argv[2];
iris.RateCenter.list({"available":true, "state":state}, function(err,list){
  console.log("There are " + list.length + " rate centers for " + state);
  console.log("First is: " + JSON.stringify(list[0]));
});