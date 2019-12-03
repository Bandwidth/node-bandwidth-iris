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
    return callback(err, item);
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
 client.makeRequest("get", client.concatAccountPath(ORDER_PATH) + "/" + id, function(err, item){
  if(err){
    return callback(err, item);
  }
  item.order.client = client;
  item.order.__proto__ = Order.prototype;
  callback(null, item);
 });
};

Order.list = function(client, query, callback){
  if(arguments.length === 2){
    callback = query;
    query = client;
    client = new Client();
  }
  client.makeRequest("get", client.concatAccountPath(ORDER_PATH), query, function(err, res){
    if(err){
      return callback(err);
    }
    callback(null, res);
  });
};

Order.prototype.getAreaCodes = function(callback){
  this.client.makeRequest("get", this.client.concatAccountPath(ORDER_PATH) + "/" + this.id + "/areaCodes", function(err,areaCodes){
    if(err){
      return callback(err);
    }
    var items = areaCodes.telephoneDetailsReport;
    callback(null, Array.isArray(items)?items:[items]);
  });
};

Order.prototype.getNpaNxx = function(callback){
  this.client.makeRequest("get", this.client.concatAccountPath(ORDER_PATH) + "/" + this.id + "/npaNxx", function(err,npaNxx){
    if(err){
      return callback(err);
    }
    var items = npaNxx.telephoneDetailsReport;
    callback(null, Array.isArray(items)?items:[items]);
  });
};

Order.prototype.getTotals = function(callback) {
  this.client.makeRequest("get", this.client.concatAccountPath(ORDER_PATH) + "/" + this.id + "/totals", function(err,totals){
    if(err){
      return callback(err);
    }
    var items = totals.telephoneDetailsReport;
    callback(null, Array.isArray(items)?items:[items]);
  });
};

Order.prototype.getTns = function(callback){
  this.client.makeRequest("get", this.client.concatAccountPath(ORDER_PATH) + "/" + this.id + "/tns", function(err,tns){
    if(err){
      return callback(err);
    }
    callback(null, tns);
  });
}

Order.prototype.getHistory = function(callback){
  this.client.makeRequest("get", this.client.concatAccountPath(ORDER_PATH) + "/" + this.id + "/history", function(err,history){
    if(err){
      return callback(err);
    }
    var items = history.orderHistory;
    callback(null, Array.isArray(items)?items:[items]);
  });
}

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
  request.buffer().then(res => {
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
  }).catch(err => {
    return callback(err);
  });
};

module.exports = Order;
