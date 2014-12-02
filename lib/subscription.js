var Client = require("./client");
var SUBSCRIPTION_PATH = "subscriptions";

function Subscription(){

}

Subscription.get = function(client, id, callback){
  if(arguments.length === 2){
    callback = id;
    id = client;
    client = new Client();
  }
  client.makeRequest("get", client.concatAccountPath(SUBSCRIPTION_PATH), null, id, function(err, res){
    if(err){
      return callback(err);
    }
    var item = res.subscriptions.subscription;
    item.client = client;
    item.__proto__ = Subscription.prototype;
    item.id = item.subscriptionId;
    callback(null, item);
  });
};

Subscription.list = function(client, query, callback){
  if(arguments.length === 1){
    callback = client;
    client = new Client();
  }
  else if(arguments.length === 2){
    callback = query;
    query = null;
  }
  client.makeRequest("get", client.concatAccountPath(SUBSCRIPTION_PATH), query, function(err, res){
    if(err){
      return callback(err);
    }
    var items = res.subscriptions || [];
    if(!Array.isArray(items)){
      items = [items];
    }
    var result = items.map(function(item){
      var i = item.subscription;
      i.client = client;
      i.__proto__ = Subscription.prototype;
      i.id = i.subscriptionId;
      return i;
    });
    callback(null, result);
  });
};

Subscription.create = function(client, item, callback){
  if(arguments.length === 2){
    callback = item;
    item = client;
    client = new Client();
  }
  var request = client.createPostRequest(client.concatAccountPath(SUBSCRIPTION_PATH), {subscription: item});
  request.buffer().end(function(res){
    if(res.ok && res.headers.location){
      Client.getIdFromLocationHeader(res.headers.location, function(err, id){
        if(err){
          return callback(err);
        }
        Subscription.get(client, id, callback);
      });
    }
    else{
      client.checkResponse(res, callback);
    }
  });
};

Subscription.prototype.update = function(data, callback){
  this.client.makeRequest("put", this.client.concatAccountPath(SUBSCRIPTION_PATH) + "/" + this.id, {subscription: data}, callback);
};

Subscription.prototype.delete = function(callback){
  this.client.makeRequest("delete", this.client.concatAccountPath(SUBSCRIPTION_PATH) + "/" + this.id, callback);
};

module.exports = Subscription;
