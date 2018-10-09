var Client = require("./client");
var LSR_ORDER_PATH = "lsrorders";

function LsrOrder() {
}

LsrOrder.get = function(client, id, callback){
  if(arguments.length === 2){
    callback = id;
    id = client;
    client = new Client();
  }
  client.makeRequest("get", client.concatAccountPath(LSR_ORDER_PATH), null, id, function(err,res){
    if(err){
      return callback(err);
    }
    var item = res;
    item.client = client;
    item.__proto__ = LsrOrder.prototype;
    callback(null, item);
  });
};

LsrOrder.list = function(client,query, callback){
  if(arguments.length === 2){
    callback = query;
    query = client;
    client = new Client();
  }
  client.makeRequest("get", client.concatAccountPath(LSR_ORDER_PATH), query, function(err,res){
    if(err){
      return callback(err);
    }
    callback(null, res);
  });
};

LsrOrder.create = function(client, item, callback){
  if(arguments.length === 2){
    callback = item;
    item = client;
    client = new Client();
  }
  var request = client.createPostRequest(client.concatAccountPath(LSR_ORDER_PATH), {lsrOrder: item});
  request.buffer().then(res => {
    if(res.ok && res.headers.location){
      Client.getIdFromLocationHeader(res.headers.location, function(err,id){
        if(err){
          return callback(err);
        }
        LsrOrder.get(client, id, callback);
      });
    }
    else{
      client.checkResponse(res, callback);
    }
  });
};

LsrOrder.prototype.update = function(data, callback){
  this.client.makeRequest("put", this.client.concatAccountPath(LSR_ORDER_PATH) + "/" + this.id, {lsrOrder: data}, callback);
};

LsrOrder.prototype.getHistory = function(callback){
  this.client.makeRequest("get", this.client.concatAccountPath(LSR_ORDER_PATH) + "/" + this.id + "/history", function(err,history){
    if(err){
      return callback(err);
    }
    var items = history.orderHistory;
    callback(null, Array.isArray(items)?items:[items]);
  });
}

LsrOrder.prototype.getNotes = function(callback){
  this.client.makeRequest("get", this.client.concatAccountPath(LSR_ORDER_PATH) + "/" + this.id + "/notes", function(err, notes){
    if(err){
      return callback(err);
    }
    var items = notes.note;
    callback(null, Array.isArray(items)?items:[items]);
  });
};

LsrOrder.prototype.addNote = function(note, callback){
  var self = this;
  var request = this.client.createPostRequest(this.client.concatAccountPath(LSR_ORDER_PATH + "/" + this.id + "/notes"), {note: note});
  request.buffer().then(res =>{
    if(res.ok && res.headers.location){
      Client.getIdFromLocationHeader(res.headers.location, function(err, id){
        if(err){
          return callback(err);
        }
        self.getNotes(function(err, notes){
          if(err){
            return callback(err);
          }
          callback(null, notes.filter(function(n){ return n.id == id;})[0]);
        });
      });
    }
    else{
     self.client.checkResponse(res, callback);
    }
  });
};

module.exports = LsrOrder;
