var Client = require("./client");
var TN_RESERVATION_PATH = "tnreservation";

function TnReservation(){

}

TnReservation.get = function(client, id, callback){
  if(arguments.length === 2){
    callback = id;
    id = client;
    client = new Client();
  }
  client.makeRequest("get", client.concatAccountPath(TN_RESERVATION_PATH), null, id, function(err, res){
    if(err){
      return callback(err);
    }
    var item = res.reservation;
    item.client = client;
    item.__proto__ = TnReservation.prototype;
    callback(null, item);
  });
};


TnReservation.create = function(client, item, callback){
  if(arguments.length === 2){
    callback = item;
    item = client;
    client = new Client();
  }
  var request = client.createPostRequest(client.concatAccountPath(TN_RESERVATION_PATH), {reservation: item});
  request.buffer().then(res => {
    if(res.ok && res.headers.location){
      Client.getIdFromLocationHeader(res.headers.location, function(err, id){
        if(err){
          return callback(err);
        }
        TnReservation.get(client, id, callback);
      });
    }
    else{
      client.checkResponse(res, callback);
    }
  }).catch(err => {
    return callback(err);
  });
};

TnReservation.prototype.delete = function(callback){
  this.client.makeRequest("delete", this.client.concatAccountPath(TN_RESERVATION_PATH) + "/" + this.id, callback);
};

module.exports = TnReservation;
