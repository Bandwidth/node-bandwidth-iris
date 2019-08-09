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

Tn.list = function(client, query, callback){
  if(arguments.length === 2){
    callback = query;
    query = client;
    client = new Client();
  }
  //"page" and "size" must be in the query due to API redirects
  //If those values are not set, initialize them to defaults
  if (!("page" in query)) {
      query["page"] = 1;
  }
  if (!("size" in query)) {
      query["size"] = 500;
  }
  client.makeRequest("get", TN_PATH, query, function(err,res){
    if(err){
      return callback(err);
    }
    var items = res.telephoneNumbers.telephoneNumber || [];
    if(!Array.isArray(items)){
      items = [items];
    }
    var result = items.map(function(item){
      var i = item;
      i.client = client;
      i.__proto__ = Tn.prototype;
      return i;
    });
    res.telephoneNumbers.telephoneNumber = result;
    callback(null, res);
  });
}

Tn.prototype.getTnDetails = function(callback){
  this.client.makeRequest("get", TN_PATH + "/" + this.telephoneNumber + "/tndetails", function(err,res){
    if(err){
      return callback(err);
    }
    callback(null, res.telephoneNumberDetails);
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
