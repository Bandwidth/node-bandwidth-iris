var fs = require("fs");
var Client = require("./client");
var ORDER_PATH = "orders";

function Order(){
}

Order.create = function(client, item, callback){
  if(arguments.length === 2){
    callback = item;
    item = client;
    client = new Client();
  };
 client.makeRequest("post", client.concatAccountPath(ORDER_PATH), {order: item}, function(err, item){
  if(err){
    return callback(err);
  }
  item.order.client = client;
  item.order.__proto__ = Order.prototype;
  callback(null, item);
 });
};

Order.get = function(client, id, callback){
  if(arguments.length === 2){
    callback = id;
    id = client;
    client = new Client();
  };
 client.makeRequest("get", client.concatAccountPath(ORDER_PATH + "/" + id), function(err, item){
  if(err){
    return callback(err);
  }
  item.order.client = client;
  item.order.__proto__ = Order.prototype;
  callback(null, item);
 });
};


Order.prototype.update = function(data, callback){
  this.client.makeRequest("put", this.client.concatAccountPath(ORDER_PATH) + "/" + this.id, {order: data}, callback);
};


Order.prototype.getNotes = function(callback){
  this.client.makeRequest("get", this.client.concatAccountPath(ORDER_PATH) + "/" + this.id + "/notes", function(err, notes){
    if(err){
      return callback(err);
    }
    var items = notes.note;
    callback(null, Array.isArray(items)?items:[items]);
  });
};

Order.prototype.addNote = function(note, callback){
  var self = this;
  var request = this.client.createPostRequest(this.client.concatAccountPath(ORDER_PATH + "/" + this.id + "/notes"), {note: note});
  request.buffer().end(function(res){
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

module.exports = Order;
