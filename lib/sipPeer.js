var Client = require("./client");
var Site = require("./site");

var SITE_PATH = "sites";
var SIP_PEER_PATH = "sippeers";
var TNS_PATH = "tns";
var MOVE_TNS_PATH = "movetns";

function SipPeer(){
};

SipPeer.create = function(client, item, callback){
 if(arguments.length === 2){
    callback = item;
    item = client;
    client = new Client();
 }
 var site = new Site();
 site.client = client;
 site.id = item.siteId;
 site.createSipPeer(item, callback);
};

SipPeer.get = function(client, siteId, id, callback){
  if(arguments.length === 3){
    callback = id;
    id = siteId;
    siteId = client;
    client = new Client();
  }
  var site = new Site();
  site.client = client;
  site.id = siteId;
  site.getSipPeer(id, callback);
};

SipPeer.list = function(client, siteId, callback){
  if(arguments.length === 2){
    callback = siteId;
    siteId = client;
    client = new Client();
  }
  var site = new Site();
  site.client = client;
  site.id = siteId;
  site.getSipPeers(callback);
};

SipPeer.prototype.delete = function(callback){
  this.client.makeRequest("delete", this.client.concatAccountPath(SITE_PATH) + "/" + this.siteId + "/" + SIP_PEER_PATH + "/" + this.id, callback);
};

SipPeer.prototype.getTns = function(number, callback){
  var url = this.client.concatAccountPath(SITE_PATH + "/" + this.siteId + "/" + SIP_PEER_PATH + "/" + this.id + "/" + TNS_PATH);
  var field = null;
  if(arguments.length === 2){
    url += "/" + number;
  }
  else{
    callback = number;
    field = "sipPeerTelephoneNumbers";
  }
  this.client.makeRequest("get", url, function(err, res){
    if(err){
      return callback(err);
    }
    callback(null, (field?res[field]:res).sipPeerTelephoneNumber);
  });
};

SipPeer.prototype.updateTns = function(number, data, callback){
  var url = this.client.concatAccountPath(SITE_PATH + "/" + this.siteId + "/" + SIP_PEER_PATH + "/" + this.id + "/" + TNS_PATH + "/" + number);
  this.client.makeRequest("put", url, {sipPeerTelephoneNumber: data}, callback);
};

SipPeer.prototype.moveTns = function(numbers, callback){
  var url = this.client.concatAccountPath(SITE_PATH + "/" + this.siteId + "/" + SIP_PEER_PATH + "/" + this.id + "/" + MOVE_TNS_PATH);
  this.client.makeRequest("post", url, {sipPeerTelephoneNumbers: {fullNumber: numbers}}, callback);
};


module.exports = SipPeer;
