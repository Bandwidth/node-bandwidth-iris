var fs = require("fs");
var Client = require("./client");
var IMPORT_TO_ACCOUNT_PATH = "importToAccounts";

function ImportToAccount(){
}

ImportToAccount.prototype.getNotes = function(callback){
  this.client.makeRequest("get", this.client.concatAccountPath(IMPORT_TO_ACCOUNT_PATH) + "/" + this.id + "/notes", function(err, notes){
    if(err){
      return callback(err);
    }
    var items = notes.note;
    callback(null, Array.isArray(items)?items:[items]);
  });
};

ImportToAccount.prototype.addNote = function(note, callback){
  var self = this;
  var request = this.client.createPostRequest(this.client.concatAccountPath(IMPORT_TO_ACCOUNT_PATH + "/" + this.id + "/notes"), {note: note});
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

module.exports = ImportToAccount;
