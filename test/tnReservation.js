var lib = require("../");
var helper = require("./helper");
var nock = require("nock");
var TnReservation = lib.TnReservation;

describe("TnReservation", function(){
  before(function(){
    nock.disableNetConnect();
    helper.setupGlobalOptions();
  });
  after(function(){
    nock.cleanAll();
    nock.enableNetConnect();
  });
  describe("#get", function(){
    it("should return a tnreservation", function(done){
      var span = helper.nock().get("/accounts/FakeAccountId/tnreservation/1").reply(200, helper.xml.tnReservation, {"Content-Type": "application/xml"});
      TnReservation.get(helper.createClient(), "1",  function(err, item){
        if(err){
          return done(err);
        }
        span.isDone().should.be.true;
        item.id.should.equal(1);
        item.accountId.should.equal(111);
        done();
      });
    });
    it("should return a tnreservation (with default client)", function(done){
      var span = helper.nock().get("/accounts/FakeAccountId/tnreservation/1").reply(200, helper.xml.tnReservation, {"Content-Type": "application/xml"});
      TnReservation.get(1,  function(err, item){
        if(err){
          return done(err);
        }
        span.isDone().should.be.true;
        item.id.should.equal(1);
        item.accountId.should.equal(111);
        done();
      });
    });
    it("should fail for error status code", function(done){
      var span = helper.nock().get("/accounts/FakeAccountId/tnreservation/1").reply(400);
      TnReservation.get(helper.createClient(), "1",  function(err, item){
        if(err){
          return done();
        }
        done(new Error("An error is estimated"));
      });
    });
  });
  describe("#create", function(){
    it("should create a  tnreservation", function(done){
      var data = {accountId: "111", reservedTn: "000"};
      helper.nock().post("/accounts/FakeAccountId/tnreservation", helper.buildXml({reservation: data})).reply(201, "", {"Location": "/accounts/FakeAccountId/tnreservation/1"});
      helper.nock().get("/accounts/FakeAccountId/tnreservation/1").reply(200, helper.xml.tnReservation, {"Content-Type": "application/xml"});
      TnReservation.create(helper.createClient(), data,  function(err, item){
        if(err){
          return done(err);
        }
        item.id.should.equal(1);
        item.accountId.should.equal(111);
        done();
      });
    });
    it("should create a  tnreservation (with default client)", function(done){
      var data = {accountId: "111", reservedTn: "000"};
      helper.nock().post("/accounts/FakeAccountId/tnreservation", helper.buildXml({reservation: data})).reply(201, "", {"Location": "/accounts/FakeAccountId/tnreservation/1"});
      helper.nock().get("/accounts/FakeAccountId/tnreservation/1").reply(200, helper.xml.tnReservation, {"Content-Type": "application/xml"});
      TnReservation.create(data,  function(err, item){
        if(err){
          return done(err);
        }
        item.id.should.equal(1);
        item.accountId.should.equal(111);
        done();
      });
    });
    it("should fail on error status code", function(done){
      var data = {accountId: "111", reservedTn: "000"};
      helper.nock().post("/accounts/FakeAccountId/tnreservation").reply(400, "");
      TnReservation.create(helper.createClient(), data,  function(err, item){
        if(err){
          return done();
        }
        done(new Error("An error is expected"));
      });
    });
  });
  describe("#delete", function(){
    it("should delete a tnreservation", function(done){
      helper.nock().delete("/accounts/FakeAccountId/tnreservation/1").reply(200);
      var tnreservation = new TnReservation();
      tnreservation.id = 1;
      tnreservation.client = helper.createClient();
      tnreservation.delete(done);
    });
  });
});
