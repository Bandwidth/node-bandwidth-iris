var Client = require("../").Client;
var nock = require("nock");
var xml = require("./xml");
module.exports = {
  setupEnvironmentVariables: function(){
    process.env.BANDWIDTH_API_ACCOUNT_ID = "FakeAccountId";
    process.env.BANDWIDTH_API_USERNAME = "FakeUserName";
    process.env.BANDWIDTH_API_PASSWORD = "FakePassword";
  },

  createClient: function(){
    return new Client("FakeAccountId", "FakeUserName", "FakePassword");
  },

  buildXml: function(obj){
    return this.createClient().buildXml(obj);
  },

  nock: function(){
    return nock("https://api.inetwork.com");
  },

  xml: xml
};
