var fs = require("fs");
var Client = require("./client");
var PORT_IN_PATH = "portins";
var LOAS_PATH = "loas";
var st = require("stream");
var streamifier = require("streamifier");

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
  item.__proto__ = PortIn.prototype;
  callback(null, item);
 });
};

PortIn.get = function(client, id, callback){
  if(arguments.length === 2){
    callback = id;
    id = client;
    client = new Client();
  };
  client.makeRequest("get", client.concatAccountPath(PORT_IN_PATH) + "/" + id, function(err, item){
    if(err){
      return callback(err);
    }
    item.client = client;
    item.id = id;
    item.__proto__ = PortIn.prototype;
    callback(null, item);
  });
};

PortIn.list = function(client, query, callback){
  if(arguments.length ===2){
    callback = query;
    query = client;
    client = new Client();
  }
  client.makeRequest("get", client.concatAccountPath(PORT_IN_PATH), query, function(err, res){
    if(err){
      return callback(err);
    }
    return callback(null, res);
  });
};


PortIn.prototype.update = function(data, callback){
  this.client.makeRequest("put", this.client.concatAccountPath(PORT_IN_PATH) + "/" + this.id, {lnpOrderSupp: data}, callback);
};

PortIn.prototype.delete = function(callback){
  this.client.makeRequest("delete", this.client.concatAccountPath(PORT_IN_PATH) + "/" + this.id, callback);
};

PortIn.prototype.getAreaCodes = function(callback){
  this.client.makeRequest("get", this.client.concatAccountPath(PORT_IN_PATH) + "/" + this.id + "/areaCodes", function(err,areaCodes){
    if(err){
      return callback(err);
    }
    var items = areaCodes.telephoneDetailsReport;
    callback(null, Array.isArray(items)?items:[items]);
  });
};

PortIn.prototype.getNpaNxx = function(callback){
  this.client.makeRequest("get", this.client.concatAccountPath(PORT_IN_PATH) + "/" + this.id + "/npaNxx", function(err,npaNxx){
    if(err){
      return callback(err);
    }
    var items = npaNxx.telephoneDetailsReport;
    callback(null, Array.isArray(items)?items:[items]);
  });
};

PortIn.prototype.getTotals = function(callback) {
  this.client.makeRequest("get", this.client.concatAccountPath(PORT_IN_PATH) + "/" + this.id + "/totals", function(err,totals){
    if(err){
      return callback(err);
    }
    var items = totals.telephoneDetailsReport;
    callback(null, Array.isArray(items)?items:[items]);
  });
};

PortIn.prototype.getTns = function(callback){
  this.client.makeRequest("get", this.client.concatAccountPath(PORT_IN_PATH) + "/" + this.id + "/tns", function(err,tns){
    if(err){
      return callback(err);
    }
    callback(null, tns);
  });
}

PortIn.prototype.getActivationStatus = function(callback){
  this.client.makeRequest("get", this.client.concatAccountPath(PORT_IN_PATH) + "/" + this.id + "/activationStatus", function(err,status){
    if(err){
      return callback(err);
    }
    callback(null, status)
  });
}

PortIn.prototype.setActivationStatus = function(data, callback){
  callback("this method is not implemented");
}


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

PortIn.prototype.getHistory = function (callback) {
  this.client.makeRequest("get", this.client.concatAccountPath(PORT_IN_PATH) + "/" + this.id + "/history", function (err, history) {
    if (err) {
      return callback(err);
    }
    var items = history.orderHistory;
    callback(null, Array.isArray(items) ? items : [items]);
  });
};

function sendFile(request, file, mediaType, callback){
  var stream = null;
  request.buffer().type(mediaType || "application/octet-stream");
  if(typeof file === "string"){
    stream = fs.createReadStream(file);
  }
  else if(Buffer.isBuffer(file)){
    stream = streamifier.createReadStream(file);
  }
  else if(typeof file.pipe === "function" && typeof file.read === "function" && typeof file.on === "function"){
    stream = file;
  }
  if(stream){
    request.on("response", callback);
    request.on("error", function(err, result){
      return err;
    });
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
      if (typeof result !== 'undefined') {
        return callback(null, result.filename);
      }
      else {
        return callback(null, "");
      }
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

PortIn.prototype.updateFileMetadata = function (fileName, metadata, callback) {
  this.client.makeRequest("put", this.client.concatAccountPath(PORT_IN_PATH + "/" + this.id + "/" + LOAS_PATH + "/" + fileName + "/metadata"),
    { fileMetaData: metadata }, callback);
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
