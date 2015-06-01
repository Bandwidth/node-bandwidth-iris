var iris = require("../");
var config = require("./config");

iris.Client.globalOptions.apiEndPoint = config.apiEndPoint;
iris.Client.globalOptions.accountId = config.accountId;
iris.Client.globalOptions.userName = config.userName;
iris.Client.globalOptions.password = config.password;

var selectedSite = config.selectedSiteId;

if(process.argv.length < 3){
  console.log("usage: node orders-create-sample [numberToOrder] e.g. node orders-create-sample 9195551212");
  process.exit(1);
}
var numberToOrder = process.argv[2];

var order = {
  name:"A Test Order",
  siteId: selectedSite,
  existingTelephoneNumberOrderType: {
    telephoneNumberList:[
      {
        telephoneNumber:numberToOrder
      }
    ]
  }
};

iris.Order.create(order, function(err,res){
  if(err){
    console.log("error: " + err);
  }else {
    console.log("Order successfully created" );
    console.log(JSON.stringify(res.order,null,2));
  }
});