var fs = require("fs");
var Client = require("./client");
var PORT_OUT_PATH = "portouts";

function PortOut(){
}

PortOut.list = function(client, query, callback){
  if(arguments.length === 2){
    callback = query;
    query = client;
    client = new Client();
  }
  client.makeRequest("get", client.concatAccountPath(PORT_OUT_PATH), query, function(err, res){
    if(err){
      return callback(err);
    }
    callback(null, res);
  });
};

PortOut.get = function(client, id, callback) {
  if(arguments.length === 2){
    callback = id;
    id = client;
    client = new Client();
  }
  client.makeRequest("get", client.concatAccountPath(PORT_OUT_PATH), null, id, function(err,res){
    if(err){
      return callback(err);
    }

    var item = res;
    item.client = client;
    item.__proto__ = PortOut.prototype;
    callback(null,item);
  })
};

PortOut.prototype.getNotes = function(callback){
  this.client.makeRequest("get", this.client.concatAccountPath(PORT_OUT_PATH) + "/" + this.id + "/notes", function(err, notes){
    if(err){
      return callback(err);
    }
    var items = notes.note;
    callback(null, Array.isArray(items)?items:[items]);
  });
};

PortOut.prototype.addNote = function(note, callback){
  var self = this;
  var request = this.client.createPostRequest(this.client.concatAccountPath(PORT_OUT_PATH + "/" + this.id + "/notes"), {note: note});
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
  }).catch(err => {
    return callback(err);
  });
};

module.exports = PortOut;
