var Client = require("./client");
var AVAILABLE_NPA_NXX_PATH = "availableNpaNxx";
module.exports = {
  list: function(client, query, callback){
    if(arguments.length === 2){
      callback = query;
      query = client;
      client = new Client();
    }
    client.makeRequest("get", client.concatAccountPath(AVAILABLE_NPA_NXX_PATH), query, function(err, res){
      if(err){
        return callback(err);
      }
      callback(null, res.availableNpaNxxList.availableNpaNxx);
    });
  }
};
