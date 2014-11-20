var Client = require(".").Client;

var SITE_PATH = "sites";

function Site(){

}

Site.get = function(client, id, callback){
  if(arguments.length === 2){
    callback = id;
    id = client;
    client = new Client();
  }
  client.makeRequest("get", client.concatAccountPath(SITE_PATH), null, id, function(err, res){
    if(err){
      return callback(err);
    }
    var item = res.site;
    item.client = client;
    item.__proto__ = Client.prototype;
    callback(null, item);
  });
};

Site.list = function(client, callback){
  if(arguments.length === 1){
    client = new Client();
  }
  client.makeRequest("get", client.concatAccountPath(SITE_PATH), function(err, res){
    if(err){
      return callback(err);
    }
    var items = res.sites || [];
    items.forEach(function(i){
      i.client = client;
      i.__proto__ = Client.prototype;
    });
    callback(null, items);
  });
};

Site.create = function(client, item, callback){
  if(arguments.length === 2){
    callback = item;
    item = client;
    client = new Client();
  }
  var request = client.createPostRequest(client.concatAccountPath(SITE_PATH), item);
  request.end(function(res){
    if(res.ok && res.headers.location){
      client.getIdFromLocationHeader(res.headers.location, function(err, id){
        if(err){
          return callback(err);
        }
        Site.get(client, id, callback);
      });
    }
    else{
      client.checkResponse(res, callback);
    }
  });
};

module.exports = Site;
