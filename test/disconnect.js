var lib = require("../");
var helper = require("./helper");
var nock = require("nock");
var Disconnect = lib.Disconnect;

describe("Disconnect", function(){
  before(function(){
    nock.disableNetConnect();
    helper.setupGlobalOptions();
  });
  after(function(){
    nock.cleanAll();
    nock.enableNetConnect();
  });
  describe("#getNotes", function(){
    it("should return notes", function(done){
      helper.nock().get("/v1.0/accounts/FakeAccountId/disconnects/1/notes").reply(200, helper.xml.notes, {"Content-Type": "application/xml"});
      var order = new Disconnect();
      order.id = 1;
      order.client = helper.createClient();
      order.getNotes(function(err, notes){
        if(err){
          return done(err);
        }
        notes.length.should.equal(2);
        notes[0].id.should.equal(11299);
        notes[0].userId.should.equal("customer");
        notes[0].description.should.equal("Test");
        done();
      });
    });
    it("should fail for error status code", function(done){
      helper.nock().get("/v1.0/accounts/FakeAccountId/disconnects/1/notes").reply(400);
      var order = new Disconnect();
      order.id = 1;
      order.client = helper.createClient();
      order.getNotes(function(err, notes){
        if(err){
          return done();
        }
        done(new Error("An error is estimated"));
      });
    });
  });
  describe("#addNote", function(){
    it("should add new note", function(done){
      var data = {userId: "customer", description: "Test"};
      helper.nock().post("/v1.0/accounts/FakeAccountId/disconnects/1/notes", helper.buildXml({note: data})).reply(200, "", {"Location": "/v1.0/accounts/FakeAccountId/portins/1/notes/11299"});
      helper.nock().get("/v1.0/accounts/FakeAccountId/disconnects/1/notes").reply(200, helper.xml.notes, {"Content-Type": "application/xml"});
      var order = new Disconnect();
      order.id = 1;
      order.client = helper.createClient();
      order.addNote(data, function(err, note){
        if(err){
          return done(err);
        }
        note.id.should.equal(11299);
        note.userId.should.equal("customer");
        note.description.should.equal("Test");
        done();
      });
    });
    it("should fail on loading notes error", function(done){
      var data = {userId: "customer", description: "Test"};
      helper.nock().post("/v1.0/accounts/FakeAccountId/disconnects/1/notes", helper.buildXml({note: data})).reply(200, "", {"Location": "/v1.0/accounts/FakeAccountId/portins/1/notes/11299"});
      helper.nock().get("/v1.0/accounts/FakeAccountId/disconnects/1/notes").reply(500);
      var order = new Disconnect();
      order.id = 1;
      order.client = helper.createClient();
      order.addNote(data, function(err, note){
        if(err){
          return done();
        }
        done(new Error("An error is estimated"));
      });
    });
    it("should fail on error status code", function(done){
      var data = {userId: "customer", description: "Test"};
      helper.nock().post("/v1.0/accounts/FakeAccountId/disconnects/1/notes", helper.buildXml({note: data})).reply(400);
      var order = new Disconnect();
      order.id = 1;
      order.client = helper.createClient();
      order.addNote(data, function(err, note){
        if(err){
          return done();
        }
        done(new Error("An error is estimated"));
      });
    });
  });
  describe("#disconnectNumbers", function(){
    it("should disconnect numbers", function(done){
      var data = {
        disconnectTelephoneNumberOrder: {
          name: "test",
          _nameXmlElement: "name",
         disconnectTelephoneNumberOrderType: {
          telephoneNumber: ["111", "222"]
         }
        }
      };
      helper.nock().post("/v1.0/accounts/FakeAccountId/disconnects", helper.buildXml(data)).reply(200);
      Disconnect.disconnectNumbers(helper.createClient(), "test", ["111", "222"], done);
    });
  });
});
