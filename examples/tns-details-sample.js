var iris = require("../");
var config = require("./config");

iris.Client.globalOptions.apiEndPoint = config.apiEndPoint;
iris.Client.globalOptions.accountId = config.accountId;
iris.Client.globalOptions.userName = config.userName;
iris.Client.globalOptions.password = config.password;

if(process.argv.length < 3){
  console.log("usage: node tns-details-sample [number] e.g. node tns-details-sample 9195551212");
  process.exit(1);
}

var tn = process.argv[2];
iris.Tn.get(tn, function(err,item){
  if(err){
    console.log(err);
  }
  console.log("TN Details: " + JSON.stringify(item, null, 2));
});