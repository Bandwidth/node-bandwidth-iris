var lib = require("../");
var helper = require("./helper");
var nock = require("nock");
var Tn = lib.Tn;

describe("Tn", function(){
  before(function(){
    nock.disableNetConnect();
    helper.setupGlobalOptions();
  });
  after(function(){
    nock.cleanAll();
    nock.enableNetConnect();
  });
  describe("#get", function(){
    it("should return a tn", function(done){
      var span = helper.nock().get("/v1.0/tns/1234").reply(200, helper.xml.tn, {"Content-Type": "application/xml"});
      Tn.get(helper.createClient(), "1234", function(err, item){
        if(err){
          return done(err);
        }
        span.isDone().should.be.true;
        item.telephoneNumber.should.equal(1234);
        item.status.should.equal("Inservice");
        new Tn();
        done();
      });
    });
    it("should return a tn (with default client)", function(done){
      var span = helper.nock().get("/v1.0/tns/1234").reply(200, helper.xml.tn, {"Content-Type": "application/xml"});
      Tn.get("1234", function(err, item){
        if(err){
          return done(err);
        }
        span.isDone().should.be.true;
        item.telephoneNumber.should.equal(1234);
        item.status.should.equal("Inservice");
        new Tn();
        done();
      });
    });

    it("should fail for error status code", function(done){
      helper.nock().get("/v1.0/tns/1234").reply(400);
      Tn.get(helper.createClient(), "1234", function(err){
        if(err){
          return done();
        }
        done(new Error("An error is estimated"));
      });
    });
  });
  describe("#getSites", function(){
    it("should return sites", function(done){
      var span = helper.nock().get("/v1.0/tns/1234/sites").reply(200, helper.xml.tnSites, {"Content-Type": "application/xml"});
      var tn = new Tn();
      tn.client = helper.createClient();
      tn.telephoneNumber = "1234";
      tn.getSites(function(err, item){
        if(err){
          return done(err);
        }
        span.isDone().should.be.true;
        item.id.should.equal(1435);
        item.name.should.equal("Sales Training");
        done();
      });
    });
  });
  describe("#getSipPeers", function(){
    it("should return peers", function(done){
      var span = helper.nock().get("/v1.0/tns/1234/sippeers").reply(200, helper.xml.tnSipPeers, {"Content-Type": "application/xml"});
      var tn = new Tn();
      tn.client = helper.createClient();
      tn.telephoneNumber = "1234";
      tn.getSipPeers(function(err, item){
        if(err){
          return done(err);
        }
        span.isDone().should.be.true;
        item.id.should.equal(4064);
        item.name.should.equal("Sales");
        done();
      });
    });
  });
  describe("#getRateCenter", function(){
    it("should return rate center", function(done){
      var span = helper.nock().get("/v1.0/tns/1234/ratecenter").reply(200, helper.xml.tnRateCenter, {"Content-Type": "application/xml"});
      var tn = new Tn();
      tn.client = helper.createClient();
      tn.telephoneNumber = "1234";
      tn.getRateCenter(function(err, item){
        if(err){
          return done(err);
        }
        span.isDone().should.be.true;
        item.state.should.equal("CO");
        item.rateCenter.should.equal("DENVER");
        done();
      });
    });
    it("should fail for error status code", function(done){
      helper.nock().get("/v1.0/tns/1234/ratecenter").reply(400);
      var tn = new Tn();
      tn.client = helper.createClient();
      tn.telephoneNumber = "1234";
      tn.getRateCenter(function(err){
        if(err){
          return done();
        }
        done(new Error("An error is estimated"));
      });
    });
  });
});
