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
        .reply(200, "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?><Response><Test>test</Test><Number>1234</Number><Bool>true</Bool></Response>", {"Content-Type": "application/xml"});
      client.makeRequest("get", "/test", {
        param1: 1,
        param2: "test",
        param3: true
      }, function(err, r){
        if(err){
          return done(err);
        }
        r.test.should.equal("test");
        r.number.should.equal(1234);
        r.bool.should.be.true;
        done();
      });
    });
    it("should make GET request with index  and parse output xml data", function(done){
      var span = nock("https://api.inetwork.com").get("/v1.0/test/10")
        .reply(200, "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?><Response><Test>test1</Test><Test>test2</Test></Response>", {"Content-Type": "application/xml"});
      client.makeRequest("get", "/test", null, "10", function(err, r){
        if(err){
          return done(err);
        }
        r.test.should.eql(["test1", "test2"]);
        done();
      });
    });
    it("should make POST request and parse output xml data", function(done){
      var span = nock("https://api.inetwork.com").post("/v1.0/test", "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?>\n<Root>\n  <Test1>test1</Test1>\n  <Test1>test2</Test1>\n</Root>")
        .reply(200, "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?><Response><Test>2014-11-19T13:44:38.123Z</Test></Response>", {"Content-Type": "application/xml"});
      client.makeRequest("post", "/test", {
        root: {
          test1: ["test1", "test2"]
        }
      }, function(err, r){
        if(err){
          return done(err);
        }
        r.test.should.be.instanceof(Date);
        r.test.toISOString().should.equal("2014-11-19T13:44:38.123Z");
        done();
      });
    });
    it("should make PUT request and parse output xml data", function(done){
      var span = nock("https://api.inetwork.com").put("/v1.0/test", "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?>\n<Root>\n  <Test1>test1</Test1>\n</Root>")
        .reply(200, "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?><Response><Test>test</Test></Response>", {"Content-Type": "application/xml"});
      client.makeRequest("put", "/test", {
        root: {
          test1: "test1"
        }
      }, function(err, r){
        if(err){
          return done(err);
        }
        r.test.should.equal("test");
        done();
      });
    });
    it("should make DELETE request and parse output xml data", function(done){
      var span = nock("https://api.inetwork.com").delete("/v1.0/test")
        .reply(200, "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?><Response><Test>test</Test></Response>", {"Content-Type": "application/xml"});
      client.makeRequest("delete", "/test", function(err, r){
        if(err){
          return done(err);
        }
        r.test.should.equal("test");
        done();
      });
    });
    it("should fail if output contains ErrorCode and Description", function(done){
      var span = nock("https://api.inetwork.com").get("/v1.0/test?param1=1&param2=test&param3=true")
        .reply(200, "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?><Response><Test><ErrorCode>400</ErrorCode><Description>Error</Description></Test></Response>", {"Content-Type": "application/xml"});
      client.makeRequest("get", "/test", {
        param1: 1,
        param2: "test",
        param3: true
      }, function(err){
        if(!err){
          return done(new Error("Error has been expected"));
        }
        err.message.should.equal("Error");
        err.code.should.equal(400);
        done();
      });
    });
    it("should fail if output contains element Error with Code and Description", function(done){
      var span = nock("https://api.inetwork.com").get("/v1.0/test?param1=1&param2=test&param3=true")
        .reply(200, "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?><Response><Test><Error><Code>400</Code><Description>Error</Description></Error></Test></Response>", {"Content-Type": "application/xml"});
      client.makeRequest("get", "/test", {
        param1: 1,
        param2: "test",
        param3: true
      }, function(err){
        if(!err){
          return done(new Error("Error has been expected"));
        }
        err.message.should.equal("Error");
        err.code.should.equal(400);
        done();
      });
    });
    it("should fail if output contains elements Errors with Code and Description", function(done){
      var span = nock("https://api.inetwork.com").get("/v1.0/test?param1=1&param2=test&param3=true")
        .reply(200, "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?><Response><Test><Errors><Code>400</Code><Description>Error</Description></Errors><Errors><Code>401</Code><Description>Error1</Description></Errors></Test></Response>", {"Content-Type": "application/xml"});
      client.makeRequest("get", "/test", {
        param1: 1,
        param2: "test",
        param3: true
      }, function(err){
        if(!err){
          return done(new Error("Error has been expected"));
        }
        err.errors.length.should.equal(2);
        err.errors[0].code.should.equal(400);
        err.errors[0].message.should.equal("Error");
        err.errors[1].code.should.equal(401);
        err.errors[1].message.should.equal("Error1");
        done();
      });
    });
    it("should fail if output contains elements Errors with Code and Description (for 1 element) ", function(done){
      var span = nock("https://api.inetwork.com").get("/v1.0/test?param1=1&param2=test&param3=true")
        .reply(200, "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?><Response><Test><Errors><Code>400</Code><Description>Error</Description></Errors></Test></Response>", {"Content-Type": "application/xml"});
      client.makeRequest("get", "/test", {
        param1: 1,
        param2: "test",
        param3: true
      }, function(err){
        if(!err){
          return done(new Error("Error has been expected"));
        }
        err.errors.length.should.equal(1);
        err.errors[0].code.should.equal(400);
        err.errors[0].message.should.equal("Error");
        err.message.should.equal(err.errors[0].message);
        done();
      });
    });
    it("should fail if output contains elements resultCode and resultMessage", function(done){
      var span = nock("https://api.inetwork.com").get("/v1.0/test?param1=1&param2=test&param3=true")
        .reply(200, "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?><Response><Test><resultCode>400</resultCode><resultMessage>Error</resultMessage></Test></Response>", {"Content-Type": "application/xml"});
      client.makeRequest("get", "/test", {
        param1: 1,
        param2: "test",
        param3: true
      }, function(err){
        if(!err){
          return done(new Error("Error has been expected"));
        }
        err.message.should.equal("Error");
        err.code.should.equal(400);
        done();
      });
    });
    it("should not fail if resultCode == 0e", function(done){
      var span = nock("https://api.inetwork.com").get("/v1.0/test?param1=1&param2=test&param3=true")
        .reply(200, "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?><Response><Test><resultCode>0</resultCode><resultMessage>Completed</resultMessage></Test></Response>", {"Content-Type": "application/xml"});
      client.makeRequest("get", "/test", {
        param1: 1,
        param2: "test",
        param3: true
      }, done);
    });
  });
});
