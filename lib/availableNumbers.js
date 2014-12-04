var Client = require("./client");
var AVAILABLE_NUMBER_PATH = "availableNumbers";
module.exports = {
  list: function(client, query, callback){
    if(arguments.length === 2){
      callback = query;
      query = client;
      client = new Client();
    }
    client.makeRequest("get", client.concatAccountPath(AVAILABLE_NUMBER_PATH), query, callback);
  }
};
