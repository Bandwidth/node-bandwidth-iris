var iris = require("../");
var config = require("./config");

iris.Client.globalOptions.apiEndPoint = config.apiEndPoint;
iris.Client.globalOptions.accountId = config.accountId;
iris.Client.globalOptions.userName = config.userName;
iris.Client.globalOptions.password = config.password;

if(process.argv.length < 3){
  console.log("usage: node tns-list-sample [npa] e.g. node tns-list-sample 818");
  process.exit(1);
}

var npa = process.argv[2];
iris.Tn.list({npa:npa}, function(err,list){
  if(err){
    console.log(err);
  }
  console.log("TN list ");
  console.log(JSON.stringify(list,null,2));
});