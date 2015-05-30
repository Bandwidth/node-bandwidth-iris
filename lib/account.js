var Client = require("./client");

module.exports = {
  get: function(client, callback){
    if(arguments.length === 1){
      callback = client;
      client = new Client();
    }
    client.makeRequest("get", client.concatAccountPath(), function(err,res){
      if(err){
        return callback(err);
      }
      callback(null, res.account);
    });
  }
}