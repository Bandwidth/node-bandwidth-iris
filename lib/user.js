var Client = require("./client");
var USER_PATH = "users";

function User(){

}

User.get = function(client, id, callback){
  if(arguments.length === 2){
    callback = id;
    id = client;
    client = new Client();
  }
  client.makeRequest("get", USER_PATH, null, id, function(err, res){
    if(err){
      return callback(err);
    }
    var item = res.site;
    item.client = client;
    item.__proto__ = Site.prototype;
    callback(null, item);
  });
};

User.list = function(client, callback){
  if(arguments.length === 1){
    callback = client;
    client = new Client();
  }
  client.makeRequest("get", USER_PATH, function(err, res){
    if(err){
      return callback(err);
    }
    var items = res.users.user || [];
    if(!Array.isArray(items)){
      items = [items];
    }
    var result = items.map(function(item){
      var i = item;
      i.client = client;
      i.__proto__ = User.prototype;
      return i;
    });
    callback(null, items);
  });
};

User.prototype.update = function(data, callback){
  //this.client.makeRequest("put", USER_PATH) + "/" + this.id, {user: data}, callback);
};

module.exports = User;