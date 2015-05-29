var iris = require("../");
var config = require("./config");

iris.Client.globalOptions.apiEndPoint = config.apiEndPoint;
iris.Client.globalOptions.accountId = config.accountId;
iris.Client.globalOptions.userName = config.userName;
iris.Client.globalOptions.password = config.password;

iris.User.list(function(err,list){
  if(err){
    console.log(err);
  }
  console.log("There are " + list.length + " users");
  console.log("First is: " + JSON.stringify(list[0]));
});