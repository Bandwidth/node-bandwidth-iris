var Client = require("../lib/").Client;
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

    it("should make GET request and parse output xml data (another way of creation of client)", function(done){
      var c = new Client({
        accountId: "accountId",
        userName: "user",
        password: "password"
      });
      var span = nock("https://api.inetwork.com").get("/v1.0/test")
        .reply(200, "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?><Response><Test>test</Test></Response>", {"Content-Type": "application/xml"});
      c.makeRequest("get", "/test", function(err, r){
        if(err){
          return done(err);
        }
        r.test.should.equal("test");
        done();
      });
    });
    it("should make GET request and handle requests without output", function(done){
      var span = nock("https://api.inetwork.com").get("/v1.0/test")
        .reply(200);
      client.makeRequest("get", "/test", done);
    });

    it("should make GET request and handle error status", function(done){
      var span = nock("https://api.inetwork.com").get("/v1.0/test")
        .reply(400);
      client.makeRequest("get", "/test", function(err, r){
        if(err){
          return done();
        }
        done(new Error("Error is expected"));
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
        .reply(200, "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?><Response><Test>test1</Test><Test>test2</Test><Test>1234567890</Test></Response>", {"Content-Type": "application/xml"});
      client.makeRequest("get", "/test", null, "10", function(err, r){
        if(err){
          return done(err);
        }
        r.test.should.eql(["test1", "test2", "1234567890"]);
        done();
      });
    });
    it("should make POST request and parse output xml data", function(done){
      var span = nock("https://api.inetwork.com").post("/v1.0/test", "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?>\n<Root>\n  <Test1>test1</Test1>\n  <Test1>test2</Test1>\n  <el>2014-11-20T00:00:00.000Z</el>\n</Root>")
        .reply(200, "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?><Response><Test>2014-11-19T13:44:38.123Z</Test></Response>", {"Content-Type": "application/xml"});
      client.makeRequest("post", "/test", {
        root: {
          test1: ["test1", "test2"],
          test2: new Date("2014-11-20T00:00:00.000Z"),
          _test2XmlElement: "el"
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
    it("should not fail if resultCode == 0", function(done){
      var span = nock("https://api.inetwork.com").get("/v1.0/test?param1=1&param2=test&param3=true")
        .reply(200, "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?><Response><Test><resultCode>0</resultCode><resultMessage>Completed</resultMessage></Test></Response>", {"Content-Type": "application/xml"});
      client.makeRequest("get", "/test", {
        param1: 1,
        param2: "test",
        param3: true
      }, done);
    });
  });
  describe("#concatAccountPath", function(){
    it("should return formatted url", function(){
      var client = new Client({accountId: "accountId"});
      client.concatAccountPath("test").should.equal("/accounts/accountId/test");
      client.concatAccountPath("/test1").should.equal("/accounts/accountId/test1");
    });
  });
  describe("#getIdFromLocationHeader", function(){
    it("should return formatted url", function(done){
      Client.getIdFromLocationHeader("/path1/path2/10", function(err, id){
        if(err){
          return done(err);
        }
        id.should.equal("10");
        Client.getIdFromLocationHeader("/path1/100/path2/11", function(err, id){
          if(err){
            return done(err);
          }
          id.should.equal("11");
          done();
        });
      });
    });
    it("should fail if id is missing", function(done){
      Client.getIdFromLocationHeader("nothing", function(err, id){
        if(err){
          return done();
        }
        done(new Error("Error is estimated"));
      });
    });
  });
});
