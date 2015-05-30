var Client = require("./client");
var DISCNUMBERS_PATH = "discnumbers";
module.exports = {
  list: function(client, query, callback){
    if(arguments.length === 2){
      callback = query;
      query = client;
      client = new Client();
    }
    client.makeRequest("get", client.concatAccountPath(DISCNUMBERS_PATH), query, function(err, res){
      if(err){
        return callback(err);
      }
      callback(null, res.telephoneNumbers);
    });
  },
  totals: function(client,callback){
    if(arguments.length === 1){
      callback = client;
      client = new Client();
    }
    client.makeRequest("get", client.concatAccountPath(DISCNUMBERS_PATH) + "/totals", function(err,res){
      if(err){
        return callback(err);
      }
      callback(null, res);
    });
  }
};
