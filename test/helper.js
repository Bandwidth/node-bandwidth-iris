var Client = require("../").Client;
var nock = require("nock");
var xml = require("./xml");
module.exports = {
  setupGlobalOptions: function(){
    Client.globalOptions.accountId = "FakeAccountId";
    Client.globalOptions.userName = "FakeUserName";
    Client.globalOptions.password = "FakePassword";
  },

  createClient: function(){
    return new Client("FakeAccountId", "FakeUserName", "FakePassword");
  },

  buildXml: function(obj){
    return this.createClient().buildXml(obj);
  },

  nock: function(){
    return nock("https://dashboard.bandwidth.com/api");
  },

  xml: xml
};
