var Client = require("./client");
var RATE_CENTER_PATH = "rateCenters";

module.exports = {
  list:function(client, query, callback){
    if(arguments.length === 2){
      callback = query;
      query = client;
      client = new Client();
    }

    client.makeRequest("get", RATE_CENTER_PATH, query, function(err, res){
      if(err){
        return callback(err);
      }
      var items = res.rateCenters.rateCenter || [];
      if(!Array.isArray(items)){
        items = [items];
      }
      callback(null, items);
      // var result = items.map(function(item){
      //   item.client = client;
      //   item.__proto__ = RateCenter.prototype;
      //   return item;
      // });
      // callback(null, result);
    });
  }
};

