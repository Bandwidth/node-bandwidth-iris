var Client = require("./client");
var INSERVICE_NUMBERS_PATH = "inserviceNumbers";

module.exports = {
  list: function(client, query, callback){
    if(arguments.length === 2){
      callback = query;
      query = client;
      client = new Client();
    }
    client.makeRequest("get", client.concatAccountPath(INSERVICE_NUMBERS_PATH), query, function(err, res){
      if(err){
        return callback(err);
      }
      callback(null, res);
    });
  },
  totals: function(client, callback){
    if(arguments.length === 1){
      callback = client;
      client = new Client();
    }
    client.makeRequest("get", client.concatAccountPath(INSERVICE_NUMBERS_PATH) + "/totals", function(err, res){
      if(err){
        return(callback(err));
      }
      callback(null,res);
    })

  },
  get: function(client, number, callback){
    if(arguments.length === 2){
      callback = number;
      number = client;
      client = new Client();
    }
    client.makeRequest("get", client.concatAccountPath(INSERVICE_NUMBERS_PATH) + "/" + number, function(err,res){
      if(err){
        return callback(err);
      }
      callback(null,{});
    });
  }
};
