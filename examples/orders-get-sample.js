var iris = require("../");
var config = require("./config");

iris.Client.globalOptions.apiEndPoint = config.apiEndPoint;
iris.Client.globalOptions.accountId = config.accountId;
iris.Client.globalOptions.userName = config.userName;
iris.Client.globalOptions.password = config.password;


if(process.argv.length < 3){
  console.log("usage: node orders-get-sample [orderId] e.g. node orders-get-sample 4e2e14b5-4c1a-4e4d-a95b-2fbfz789373");
  process.exit(1);
}
var orderId = process.argv[2];

iris.Order.get(orderId, function(err,order){
  if(err){
    console.log("error: " + err);
  }else {
    console.log("Order Details:" );
    console.log(JSON.stringify(order,null,2));
  }
});