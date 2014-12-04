var Client = require("./client");
var CITY_PATH = "cities";
module.exports = {
  list: function(client, query, callback){
    if(arguments.length === 2){
      callback = query;
      query = client;
      client = new Client();
    }
    client.makeRequest("get", CITY_PATH, query, function(err, res){
      if(err){
        return callback(err);
      }
      callback(null, res.cities.city);
    });
  }
};
