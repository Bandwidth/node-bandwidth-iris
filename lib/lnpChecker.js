var Client = require("./client");
var LNP_CHECKER_PATH = "lnpchecker";
module.exports = {
  check: function(client, numbers, fullCheck, callback){
    if(arguments.length === 3){
      if(typeof arguments[1] === "boolean"){
        callback = fullCheck;
        fullCheck = numbers;
        numbers = client;
        client = new Client();
      }
      else{
        callback = fullCheck;
        fullCheck = false;
      }
    }
    else if(arguments.length === 2){
      callback = numbers;
      numbers = client;
      fullCheck = false;
      client = new Client();
    }
    var data = {
      numberPortabilityRequest:{
        tnList: {
          tn:numbers
        }
      }
    };
    client.makeRequest("post", client.concatAccountPath(LNP_CHECKER_PATH) + "?fullCheck=" + fullCheck, data, callback);
  }
};
