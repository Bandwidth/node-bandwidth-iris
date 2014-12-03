var fs = require("fs");
var Client = require("./client");
var PORT_IN_PATH = "portins";
var LOAS_PATH = "loas";

function PortIn(){
}

PortIn.create = function(client, item, callback){
  if(arguments.length === 2){
    callback = item;
    item = client;
    client = new Client();
  };
 client.makeRequest("post", client.concatAccountPath(PORT_IN_PATH), {lnpOrder: item}, function(err, item){
  if(err){
    return callback(err);
  }
  item.client = client;
  item.id = item.orderId;
  callback(null, item);
 });
};


PortIn.prototype.update = function(data, callback){
  this.client.makeRequest("put", this.client.concatAccountPath(PORT_IN_PATH) + "/" + this.id, {lnpOrderSupp: data}, callback);
};

PortIn.prototype.delete = function(callback){
  this.client.makeRequest("delete", this.client.concatAccountPath(PORT_IN_PATH) + "/" + this.id, callback);
};

PortIn.prototype.getNotes = function(callback){
  this.client.makeRequest("get", this.client.concatAccountPath(PORT_IN_PATH) + "/" + this.id + "/notes", function(err, notes){
    if(err){
      return callback(err);
    }
    var items = notes.note;
    callback(null, Array.isArray(items)?items:[items]);
  });
};

PortIn.prototype.addNote = function(note, callback){
  var self = this;
  var request = this.client.createPostRequest(this.client.concatAccountPath(PORT_IN_PATH + "/" + this.id + "/notes"), {note: note});
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

function sendFile(request, file, mediaType, callback){
  var stream = null;
  request.buffer().type(mediaType || "application/octet-stream");
  if(typeof file === "string"){
    stream = fs.createReadStream(file);
  }
  else if(Buffer.isBuffer(file)){
    request.write(file);
    request.end(callback);
    return;
  }
  else if(typeof file.pipe === "function" && typeof file.read === "function" && typeof file.on === "function"){
    stream = file;
  }
  if(stream){
    request.on("response", callback);
    stream.pipe(request);
    return;
  }
  throw new Error("Invalid data to send");
}

PortIn.prototype.createFile = function(file, mediaType, callback){
  if(arguments.length === 2){
    callback = mediaType;
    mediaType = null;
  }
  var client = this.client;
  var request = client.createPostRequest(client.concatAccountPath(PORT_IN_PATH + "/" + this.id + "/" + LOAS_PATH));
  sendFile(request, file, mediaType, function(res){
    client.checkResponse(res, function(err, result){
      if(err){
        return callback(err);
      }
      callback(null, result.filename);
    });
  });
};

PortIn.prototype.updateFile = function(fileName, file, mediaType, callback){
  if(arguments.length === 3){
    callback = mediaType;
    mediaType = null;
  }
  var request = this.client.createPutRequest(this.client.concatAccountPath(PORT_IN_PATH + "/" + this.id + "/" + LOAS_PATH + "/" + fileName));
  var client = this.client;
  sendFile(request, file, mediaType, function(res){
    client.checkResponse(res, callback);
  });
};

PortIn.prototype.getFileMetadata = function(fileName, callback){
  this.client.makeRequest("get", this.client.concatAccountPath(PORT_IN_PATH + "/" + this.id + "/" + LOAS_PATH + "/" + fileName + "/metadata"), callback);
};

PortIn.prototype.getFiles = function(metadata, callback){
  if(arguments.length === 1){
    callback = metadata;
    metadata = false;
  }
  this.client.makeRequest("get", this.client.concatAccountPath(PORT_IN_PATH + "/" + this.id + "/" + LOAS_PATH), {metadata: metadata}, function(err, result){
    if(err){
      return callback(err);
    }
    callback(null, result.fileData);
  });
};

PortIn.prototype.getFile = function(fileName, destination){
  var request = this.client.createGetRequest(this.client.concatAccountPath(PORT_IN_PATH + "/" + this.id + "/" + LOAS_PATH + "/" + fileName));
  if(destination){
    var stream = null;
    if(typeof destination === "string"){
      stream = fs.createWriteStream(destination);
    }
    else if(typeof destination.write === "function"){
      stream = destination;
    }
    if(stream){
      return request.pipe(stream);
    }
  }
  return request;
}
module.exports = PortIn;
