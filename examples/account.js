var iris = require("../");
var config = require("./config");

iris.Client.globalOptions.apiEndPoint = config.apiEndPoint;
iris.Client.globalOptions.accountId = config.accountId;
iris.Client.globalOptions.userName = config.userName;
iris.Client.globalOptions.password = config.password;

iris.Account.get(function(err,account){
  if(err){
    console.log(err);
  }else {
    console.log("Your account Id: " + account.accountId);
  }
});