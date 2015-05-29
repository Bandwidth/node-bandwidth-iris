var iris = require("../");
var config = require("./config");

iris.Client.globalOptions.apiEndPoint = config.apiEndPoint;
iris.Client.globalOptions.accountId = config.accountId;
iris.Client.globalOptions.userName = config.userName;
iris.Client.globalOptions.password = config.password;

iris.CoveredRateCenter.list({"zip":"27615"}, function(err,res){
  console.log(res.coveredRateCenter[0].name);;
});
