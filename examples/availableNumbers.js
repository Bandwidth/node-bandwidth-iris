var iris = require("../");
var config = require("./config");

iris.Client.globalOptions.apiEndPoint = config.apiEndPoint;
iris.Client.globalOptions.accountId = config.accountId;
iris.Client.globalOptions.userName = config.userName;
iris.Client.globalOptions.password = config.password;

if(process.argv.length < 4){
  console.log("usage: node availableNumbers [state] [qty] e.g. node availableNumbers 919 3");
  process.exit(1);
}

var state = process.argv[2];
var quantity = process.argv[3];

iris.AvailableNumbers.list({state:state, quantity:quantity}, function(err, res){
  if(err){
    console.log(err);
  } else {
    console.log("result: " + JSON.stringify(res));
  }
});