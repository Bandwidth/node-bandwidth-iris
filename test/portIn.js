var lib = require("../");
var helper = require("./helper");
var nock = require("nock");
var PortIn = lib.PortIn;

describe("PortIn", function(){
  before(function(){
    nock.disableNetConnect();
    helper.setupGlobalOptions();
  });
  after(function(){
    nock.cleanAll();
    nock.enableNetConnect();
  });
  describe("#create", function(){
    it("should create an order", function(done){
      var data = {
        billingTelephoneNumber: "1111",
        subscriber: {
          subscriberType: "BUSINESS",
          businessName: "Company",
          serviceAddress: {
            city: "City",
            country: "Country"
          }
        }
      };
      helper.nock().post("/v1.0/accounts/FakeAccountId/portins", helper.buildXml({lnpOrder: data})).reply(200, helper.xml.portIn);
      PortIn.create(helper.createClient(), data, function(err, item){
        if(err){
          return done(err);
        }
        item.id.should.equal("d28b36f7-fa96-49eb-9556-a40fca49f7c6");
        item.status.code.should.equal(201);
        item.processingStatus.should.equal("PENDING_DOCUMENTS");
        item.billingType.should.equal("PORTIN");
        done();
      });
    });
    it("should create an order (with default client)", function(done){
      var data = {
        billingTelephoneNumber: "1111",
        subscriber: {
          subscriberType: "BUSINESS",
          businessName: "Company",
          serviceAddress: {
            city: "City",
            country: "Country"
          }
        }
      };
      helper.nock().post("/v1.0/accounts/FakeAccountId/portins", helper.buildXml({lnpOrder: data})).reply(200, helper.xml.portIn);
      PortIn.create(data, function(err, item){
        if(err){
          return done(err);
        }
        item.id.should.equal("d28b36f7-fa96-49eb-9556-a40fca49f7c6");
        item.status.code.should.equal(201);
        item.processingStatus.should.equal("PENDING_DOCUMENTS");
        item.billingType.should.equal("PORTIN");
        done();
      });
    });
    it("should fail on error status code", function(done){
      var data = {
        billingTelephoneNumber: "1111",
        subscriber: {
          subscriberType: "BUSINESS",
          businessName: "Company",
          serviceAddress: {
            city: "City",
            country: "Country"
          }
        }
      };
      helper.nock().post("/v1.0/accounts/FakeAccountId/portins").reply(400, "");
      PortIn.create(helper.createClient(), data,  function(err, item){
        if(err){
          return done();
        }
        done(new Error("An error is expected"));
      });
    });
  });
  describe("#update", function(){
    it("should update a site", function(done){
      var data = {
        requestedFocDate: "2014-11-18T00:00:00.000Z",
        wirelessInfo: {
          accountNumber: "77129766500001",
          pinNumber: "0000"
        }
      };
      helper.nock().put("/v1.0/accounts/FakeAccountId/portins/1", helper.buildXml({lnpOrderSupp: data})).reply(200);
      var order = new PortIn();
      order.id = 1;
      order.client = helper.createClient();
      order.update(data, done);
    });
  });
  describe("#delete", function(){
    it("should delete a site", function(done){
      helper.nock().delete("/v1.0/accounts/FakeAccountId/portins/1").reply(200);
      var order = new PortIn();
      order.id = 1;
      order.client = helper.createClient();
      order.delete(done);
    });
  });
  describe("#getNotes", function(){
    it("should return notes", function(done){
      helper.nock().get("/v1.0/accounts/FakeAccountId/portins/1/notes").reply(200, helper.xml.notes, {"Content-Type": "application/xml"});
      var order = new PortIn();
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
      helper.nock().get("/v1.0/accounts/FakeAccountId/portins/1/notes").reply(400);
      var order = new PortIn();
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
      helper.nock().post("/v1.0/accounts/FakeAccountId/portins/1/notes", helper.buildXml({note: data})).reply(200, "", {"Location": "/v1.0/accounts/FakeAccountId/portins/1/notes/11299"});
      helper.nock().get("/v1.0/accounts/FakeAccountId/portins/1/notes").reply(200, helper.xml.notes, {"Content-Type": "application/xml"});
      var order = new PortIn();
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
  });
});
