var Client = require("../lib/client");
var nock = require("nock");
describe("client tests", function(){
  before(function(){
    nock.disableNetConnect();
  });
  after(function(){
    nock.cleanAll();
    nock.enableNetConnect();
  });
  describe("#constructor", function(){
    it("should create client instance", function(){
      var client = new Client();
      client.should.be.instanceof(Client);
      Client().should.be.instanceof(Client);
    });
  });
  describe("#makeRequest", function(){
    var client = new Client("accountId", "user", "password");
    it("should make GET request and parse output xml data", function(done){
      var span = nock("https://api.inetwork.com").get("/v1.0/test")
        .reply(200, "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?><Response><Test>test</Test></Response>", {"Content-Type": "application/xml"});
      client.makeRequest("get", "/test", function(err, r){
        if(err){
          return done(err);
        }
        r.test.should.equal("test");
        done();
      });
    });

    it("should make GET request with query and parse output xml data", function(done){
      var span = nock("https://api.inetwork.com").get("/v1.0/test?param1=1&param2=test&param3=true")
        .reply(200, "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?><Response><Test>test</Test></Response>", {"Content-Type": "application/xml"});
      client.makeRequest("get", "/test", {
        param1: 1,
        param2: "test",
        param3: true
      }, function(err, r){
        if(err){
          return done(err);
        }
        r.test.should.equal("test");
        done();
      });
    });
    it("should make GET request with index  and parse output xml data", function(done){
      var span = nock("https://api.inetwork.com").get("/v1.0/test/10")
        .reply(200, "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?><Response><Test>test</Test></Response>", {"Content-Type": "application/xml"});
      client.makeRequest("get", "/test", null, "10", function(err, r){
        if(err){
          return done(err);
        }
        r.test.should.equal("test");
        done();
      });
    });
  });
});
