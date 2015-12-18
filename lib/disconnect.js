var fs = require("fs");
var Client = require("./client");
var DISCONNECT_PATH = "disconnects";

function Disconnect(){
}

Disconnect.create = function (client, orderName, numbers, callback){
  if(arguments.length === 3){
    callback = numbers;
    numbers = orderName;
    orderName = client;
    client = new Client();
  }
  var data = {
    disconnectTelephoneNumberOrder:{
      name: orderName,
      _nameXmlElement: "name",
      disconnectTelephoneNumberOrderType: {
        telephoneNumberList:
          numbers.map(function(number) {
            return {telephoneNumber: number};
          })
      }
    }
  };
  client.makeRequest("post", client.concatAccountPath(DISCONNECT_PATH), data, callback);
};

Disconnect.get = function(client, id, query, callback){
  if(arguments.length === 3){
    callback = query;
    query = id;
    id = client;
    client = new Client();
  }
  client.makeRequest("get", client.concatAccountPath(DISCONNECT_PATH + "/" + id), query, function(err,res){
    if(err){
      return callback(err);
    }
    callback(null,res);
  });

}

Disconnect.prototype.getNotes = function(callback){
  this.client.makeRequest("get", this.client.concatAccountPath(DISCONNECT_PATH) + "/" + this.id + "/notes", function(err, notes){
    if(err){
      return callback(err);
    }
    var items = notes.note;
    callback(null, Array.isArray(items)?items:[items]);
  });
};

Disconnect.prototype.addNote = function(note, callback){
  var self = this;
  var request = this.client.createPostRequest(this.client.concatAccountPath(DISCONNECT_PATH + "/" + this.id + "/notes"), {note: note});
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

module.exports = Disconnect;
