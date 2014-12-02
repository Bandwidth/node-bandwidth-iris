var Client = require("./client");
var TN_PATH = "tns";

function Tn(){
}

Tn.get = function(client, number, callback){
  if(arguments.length === 2){
    callback = number;
    number = client;
    client = new Client();
  }
  client.makeRequest("get", TN_PATH + "/" + number, function(err, item){
    if(err){
      return callback(err);
    }
    item.client = client;
    item.__proto__ = Tn.prototype;
    callback(null, item);
  });
};

Tn.prototype.getSites = function(callback){
  this.client.makeRequest("get", TN_PATH + "/" + this.telephoneNumber + "/sites", callback);
};

Tn.prototype.getSipPeers = function(callback){
  this.client.makeRequest("get", TN_PATH + "/" + this.telephoneNumber + "/sippeers", callback);
};

Tn.prototype.getRateCenter = function(callback){
  this.client.makeRequest("get", TN_PATH + "/" + this.telephoneNumber + "/ratecenter", function(err, res){
    if(err){
      return callback(err);
    }
    callback(null, res.telephoneNumberDetails);
  });
};

module.exports = Tn;
