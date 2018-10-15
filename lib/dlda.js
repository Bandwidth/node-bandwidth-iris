var Client = require("./client");
var DLDA_PATH = "dldas";

function Dlda() {

}

Dlda.create = function(client, item, callback){
  if(arguments.length === 2){
    callback = item;
    item = client;
    client = new Client();
  }
  var request = client.createPostRequest(client.concatAccountPath(DLDA_PATH), {dldaOrder: item});
  request.buffer().then(res => {
    if(res.ok && res.headers.location){
      Client.getIdFromLocationHeader(res.headers.location, function(err,id){
        if(err){
          return callback(err);
        }
        Dlda.get(client, id, callback);
      });
    }
    else{
      client.checkResponse(res, callback);
    }
  });
};

Dlda.list = function(client,query, callback){
  if(arguments.length === 2){
    callback = query;
    query = client;
    client = new Client();
  }
  client.makeRequest("get", client.concatAccountPath(DLDA_PATH), query, function(err,res){
    if(err){
      return callback(err);
    }
    callback(null, res);
  });
};

Dlda.get = function(client, id, callback){
  if(arguments.length === 2){
    callback = id;
    id = client;
    client = new Client();
  }
  client.makeRequest("get", client.concatAccountPath(DLDA_PATH), null, id, function(err,res){
    if(err){
      return callback(err);
    }
    var item = res.dldaOrder;
    item.client = client;
    item.__proto__ = Dlda.prototype;
    callback(null, item);
  });
};

Dlda.prototype.getHistory = function(callback){
  this.client.makeRequest("get", this.client.concatAccountPath(DLDA_PATH) + "/" + this.id + "/history", function(err,history){
    if(err){
      return callback(err);
    }
    var items = history.orderHistory;
    callback(null, Array.isArray(items)?items:[items]);
  });
}

module.exports = Dlda;
