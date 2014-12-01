var Client = require("./client");
var SipPeer = require("./sipPeer");
var SITE_PATH = "sites";
var SIP_PEER_PATH = "sippeers";

function Site(){

}

Site.get = function(client, id, callback){
  if(arguments.length === 2){
    callback = id;
    id = client;
    client = new Client();
  }
  client.makeRequest("get", client.concatAccountPath(SITE_PATH), null, id, function(err, res){
    if(err){
      return callback(err);
    }
    var item = res.site;
    item.client = client;
    item.__proto__ = Site.prototype;
    callback(null, item);
  });
};

Site.list = function(client, callback){
  if(arguments.length === 1){
    callback = client;
    client = new Client();
  }
  client.makeRequest("get", client.concatAccountPath(SITE_PATH), function(err, res){
    if(err){
      return callback(err);
    }
    var items = res.sites || [];
    if(!Array.isArray(items)){
      items = [items];
    }
    var result = items.map(function(item){
      var i = item.site;
      i.client = client;
      i.__proto__ = Site.prototype;
      return i;
    });
    callback(null, result);
  });
};

Site.create = function(client, item, callback){
  if(arguments.length === 2){
    callback = item;
    item = client;
    client = new Client();
  }
  var request = client.createPostRequest(client.concatAccountPath(SITE_PATH), {site: item});
  request.buffer().end(function(res){
    if(res.ok && res.headers.location){
      Client.getIdFromLocationHeader(res.headers.location, function(err, id){
        if(err){
          return callback(err);
        }
        Site.get(client, id, callback);
      });
    }
    else{
      client.checkResponse(res, callback);
    }
  });
};

Site.prototype.update = function(data, callback){
  this.client.makeRequest("put", this.client.concatAccountPath(SITE_PATH) + "/" + this.id, {site: data}, callback);
};

Site.prototype.delete = function(callback){
  this.client.makeRequest("delete", this.client.concatAccountPath(SITE_PATH) + "/" + this.id, callback);
};

Site.prototype.getSipPeers = function(callback){
  var client = this.client;
  client.makeRequest("get", this.client.concatAccountPath(SITE_PATH) + "/" + this.id + "/" + SIP_PEER_PATH,  function(err, res){
    if(err){
      return callback(err);
    }
    var items = res.sipPeers;
    if(!Array.isArray(items)){
      items = [items];
    }
    callback(null, items.map(function(i){
      var item = i.sipPeer;
      item.client = client;
      item.__proto__ = SipPeer.prototype;
      item.id = item.peerId;
      return item;
    }));
  });
};

Site.prototype.getSipPeer = function(id, callback){
  var client = this.client;
  client.makeRequest("get", this.client.concatAccountPath(SITE_PATH) + "/" + this.id + "/" + SIP_PEER_PATH + "/" + id,  function(err, res){
    if(err){
      return callback(err);
    }
    var item = res.sipPeer;
    item.client = client;
    item.__proto__ = SipPeer.prototype;
    item.id = item.peerId;
    callback(null, item);
  });
};

Site.prototype.createSipPeer = function(item, callback){
  var client = this.client;
  var self = this;
  var request = client.createPostRequest( this.client.concatAccountPath(SITE_PATH) + "/" + this.id + "/" + SIP_PEER_PATH, {sipPeer: item});
  request.buffer().end(function(res){
    if(res.ok && res.headers.location){
      Client.getIdFromLocationHeader(res.headers.location, function(err, id){
        if(err){
          return callback(err);
        }
        self.getSipPeer(id, callback);
      });
    }
    else{
      client.checkResponse(res, callback);
    }
  });
};

module.exports = Site;
