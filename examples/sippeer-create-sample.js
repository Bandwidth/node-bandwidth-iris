var iris = require("../");
var config = require("./config");

iris.Client.globalOptions.apiEndPoint = config.apiEndPoint;
iris.Client.globalOptions.accountId = config.accountId;
iris.Client.globalOptions.userName = config.userName;
iris.Client.globalOptions.password = config.password;

var selectedSite = config.selectedSiteId;

if(process.argv.length < 3){
  console.log("usage: node sippeer-create-sample [host] e.g. node sippeer-create-sample 1.1.1.1");
  process.exit(1);
}

var host = process.argv[2];

var data = {
  peerName:"A New SIP Peer",
  isDefaultPeer:false, 
  shortMessagingProtocol:"SMPP",
  siteId:selectedSite, 
  voiceHosts:[
    {
      host:{
        hostName:host
      }
    }
  ],
  smsHosts:[
    {
      host:{
        hostName:host
      }
    }
  ],
  terminationHosts:[
    {
      terminationHost:{
        hostName:host,
        port:5060,
      }
    }
  ]
};

iris.SipPeer.create(data, function(err,res){
  if(err){
    console.log("error: " + err);
  }else {
    console.log("SipPeer successfully created" );
    console.log(JSON.stringify(res,null,2));
  }
});