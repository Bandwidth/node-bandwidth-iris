var iris = require("../");
var config = require("./config");

iris.Client.globalOptions.apiEndPoint = config.apiEndPoint;
iris.Client.globalOptions.accountId = config.accountId;
iris.Client.globalOptions.userName = config.userName;
iris.Client.globalOptions.password = config.password;

if(process.argv.length < 3){
  console.log("usage: node coveredRateCenters [zip] e.g. node rateCenters 27609");
  process.exit(1);
}

var zip = process.argv[2];
iris.CoveredRateCenter.list({"zip":zip}, function(err,list){
  console.log("First in list: " + JSON.stringify(list, null, 2));
});