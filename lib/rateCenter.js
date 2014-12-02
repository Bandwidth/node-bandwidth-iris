var Client = require("./client");
var RATE_CENTER_PATH = "rateCenters";

function RateCenter(){

}

RateCenter.list = function(client, callback){
  if(arguments.length === 1){
    callback = client;
    client = new Client();
  }
  client.makeRequest("get", RATE_CENTER_PATH, function(err, res){
    if(err){
      return callback(err);
    }
    var items = res.rateCenters.rateCenter || [];
    if(!Array.isArray(items)){
      items = [items];
    }
    var result = items.map(function(item){
      item.client = client;
      item.__proto__ = RateCenter.prototype;
      return item;
    });
    callback(null, result);
  });
};

module.exports = RateCenter;
