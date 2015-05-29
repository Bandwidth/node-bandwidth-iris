var Client = require("./client");
var COVERED_RATE_CENTER_PATH = "coveredRateCenters";

module.exports = {
  list: function(client, query, callback){
    if(arguments.length === 2){
      callback = query;
      query = client;
      client = new Client();
    }
    client.makeRequest("get", COVERED_RATE_CENTER_PATH, query, function(err, res){
      if(err){
        return callback(err);
      }
      var items = res.coveredRateCenter || [];
      if(!Array.isArray(items)){
        items = [items];
      }
      callback(null, items);
    });
  }
};

