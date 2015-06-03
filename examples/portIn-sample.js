var iris = require("../");
var config = require("./config");
var fs = require("fs");

iris.Client.globalOptions.apiEndPoint = config.apiEndPoint;
iris.Client.globalOptions.accountId = config.accountId;
iris.Client.globalOptions.userName = config.userName;
iris.Client.globalOptions.password = config.password;

var selectedSite = config.selectedSiteId;
var selectedPeer = config.selectedSipPeerId

if(selectedSite === undefined || selectedPeer === undefined){
  console.log("You must configure a site and sip peer for this demo in your config file");
  process.exit(1);
}

if(process.argv.length < 3){
  console.log("usage: node portIn-sample.js [number] e.g. node portIn-sample 9195551212");
  process.exit(1);
}

var numberToCheck = [process.argv[2]];

iris.LnpChecker.check(numberToCheck, function(err,res){
  if(err){
    console.log(err)
  }else {
    console.log(res.portableNumbers.tn);
    if(res.portableNumbers && res.portableNumbers.tn == numberToCheck){
      console.log("Your number is portable.  Creating PortIn Order");
      iris.PortIn.create(createPortInOrder(numberToCheck), function(err, portIn){
        if(err){
          console.log("Port In create failed " + err);
          process.exit(1);
        }else {
          console.log("Created portIn Order : " + portIn.id);
          portIn.createFile(fs.createReadStream("./loa.pdf"), "application/pdf", function(err, fileName){
            if(err){
              console.log("Could not upload file " + err);
            }else {
              console.log("Successfully uploaded LOA");
            }
          });
        }
      });
    }
  }
});


function createPortInOrder(numberToPort){
  var data = {
    siteId:selectedSite,
    peerId:selectedPeer,
    billingTelephoneNumber: numberToPort,
    subscriber: {
      subscriberType: "BUSINESS",
      businessName: "Company",
      serviceAddress: {
        houseNumber: "123",
        streetName: "EZ Street",
        city: "Raleigh",
        stateCode: "NC",
        zip:"27615",
        county: "Wake"
      }
    }, 
    loaAuthorizingPerson: "Joe Blow",
    listOfPhoneNumbers: {
      phoneNumber:numberToPort
    },
    billingType: "PORTIN"
  };
  return data;
}