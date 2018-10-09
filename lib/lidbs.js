var Client = require("./client");
var LIDBS_ORDER_PATH = "lidbs";

function Lidbs() {

}

Lidbs.create = function(client, item, callback){
  if(arguments.length === 2){
    callback = item;
    item = client;
    client = new Client();
  }
  var request = client.createPostRequest(client.concatAccountPath(LIDBS_ORDER_PATH), {lidbOrder: item});
  request.buffer().then(res =>{
    if(res.ok && res.headers.location){
      Client.getIdFromLocationHeader(res.headers.location, function(err,id){
        if(err){
          return callback(err);
        }
        Lidbs.get(client, id, callback);
      });
    }
    else{
      client.checkResponse(res, callback);
    }
  });
};

Lidbs.list = function(client,query, callback){
  if(arguments.length === 2){
    callback = query;
    query = client;
    client = new Client();
  }
  client.makeRequest("get", client.concatAccountPath(LIDBS_ORDER_PATH), query, function(err,res){
    if(err){
      return callback(err);
    }
    callback(null, res);
  });
};

Lidbs.get = function(client, id, callback){
  if(arguments.length === 2){
    callback = id;
    id = client;
    client = new Client();
  }
  client.makeRequest("get", client.concatAccountPath(LIDBS_ORDER_PATH), null, id, function(err,res){
    if(err){
      return callback(err);
    }
    callback(null, res);
  });
};

module.exports = Lidbs;


