var fs = require("fs");
var Client = require("./client");
var IMPORT_TO_ACCOUNT_PATH = "importToAccounts";

function ImportToAccount(){
}

// TODO: This method / object is odd.  No corresponding GET method to retrieve future orders.
// Breaks "pattern" of other orders.  As a result I'm returning whatever we get from the response
ImportToAccount.create = function(client, item, callback){
  if(arguments.length === 2){
    callback = item;
    item = client;
    client = new Client();
  }
  var request = client.createPostRequest(client.concatAccountPath(IMPORT_TO_ACCOUNT_PATH), {importToAccountNumberOrder: item});
  request.buffer().then(res =>{
    if(res.ok){
      callback(null, res.body)
    }else {
      client.checkResponse(res, callback);
    }
    // if(res.ok && res.headers.location){
    //   Client.getIdFromLocationHeader(res.headers.location, function(err, id){
    //     if(err){
    //       return callback(err);
    //     }
    //     ImportToAccount.get(client, id, callback);
    //   });
    // }
    // else{
    //   client.checkResponse(res, callback);
    // }
  });
};

ImportToAccount.list = function(client, query, callback){
  if(arguments.length === 2){
    callback = query;
    query = client;
    client = new Client();
  }
  client.makeRequest("get", client.concatAccountPath(IMPORT_TO_ACCOUNT_PATH), query, function(err,res){
    if(err){
      return callback(err);
    }
    callback(null,res);
  });
}

// Commenting these methods as they are not in the documentation anymore.

// ImportToAccount.prototype.getNotes = function(callback){
//   this.client.makeRequest("get", this.client.concatAccountPath(IMPORT_TO_ACCOUNT_PATH) + "/" + this.id + "/notes", function(err, notes){
//     if(err){
//       return callback(err);
//     }
//     var items = notes.note;
//     callback(null, Array.isArray(items)?items:[items]);
//   });
// };

// ImportToAccount.prototype.addNote = function(note, callback){
//   var self = this;
//   var request = this.client.createPostRequest(this.client.concatAccountPath(IMPORT_TO_ACCOUNT_PATH + "/" + this.id + "/notes"), {note: note});
//   request.buffer().end(function(res){
//     if(res.ok && res.headers.location){
//       Client.getIdFromLocationHeader(res.headers.location, function(err, id){
//         if(err){
//           return callback(err);
//         }
//         self.getNotes(function(err, notes){
//           if(err){
//             return callback(err);
//           }
//           callback(null, notes.filter(function(n){ return n.id == id;})[0]);
//         });
//       });
//     }
//     else{
//       self.client.checkResponse(res, callback);
//     }
//   });
// };

module.exports = ImportToAccount;
