var lib = require("../");
var helper = require("./helper");
var nock = require("nock");
var LnpChecker = lib.LnpChecker;

describe("LnpChecker", function(){
  before(function(){
    nock.disableNetConnect();
    helper.setupGlobalOptions();
  });
  after(function(){
    nock.cleanAll();
    nock.enableNetConnect();
  });
  describe("#check", function(){
    it("should check numbers", function(done){
      var numbers = ["1111", "2222"];
      var data = {numberPortabilityRequest: {tnList:{tn: numbers}}};
      var span = helper.nock().post("/accounts/FakeAccountId/lnpchecker?fullCheck=true", helper.buildXml(data)).reply(200, helper.xml.lnpCheck, {"Content-Type": "application/xml"});
      LnpChecker.check(helper.createClient(), numbers, true,  function(err, result){
        if(err){
          return done(err);
        }
        span.isDone().should.be.true;
        result.supportedRateCenters.rateCenterGroup.rateCenter.should.equal("Center1");
        result.supportedRateCenters.rateCenterGroup.city.should.equal("City1");
        result.supportedRateCenters.rateCenterGroup.state.should.equal("State1");
        done();
      });
    });
    it("should check numbers (with default client)", function(done){
      var numbers = ["1111", "2222"];
      var data = {numberPortabilityRequest: {tnList:{tn: numbers}}};
      var span = helper.nock().post("/accounts/FakeAccountId/lnpchecker?fullCheck=true", helper.buildXml(data)).reply(200, helper.xml.lnpCheck, {"Content-Type": "application/xml"});
      LnpChecker.check(numbers, true,  function(err, result){
        if(err){
          return done(err);
        }
        span.isDone().should.be.true;
        result.supportedRateCenters.rateCenterGroup.rateCenter.should.equal("Center1");
        result.supportedRateCenters.rateCenterGroup.city.should.equal("City1");
        result.supportedRateCenters.rateCenterGroup.state.should.equal("State1");
        done();
      });
    });
    it("should check numbers (with omitted fullCheck)", function(done){
      var numbers = ["1111", "2222"];
      var data = {numberPortabilityRequest: {tnList:{tn: numbers}}};
      var span = helper.nock().post("/accounts/FakeAccountId/lnpchecker?fullCheck=false", helper.buildXml(data)).reply(200, helper.xml.lnpCheck, {"Content-Type": "application/xml"});
      LnpChecker.check(helper.createClient(), numbers, function(err, result){
        if(err){
          return done(err);
        }
        span.isDone().should.be.true;
        result.supportedRateCenters.rateCenterGroup.rateCenter.should.equal("Center1");
        result.supportedRateCenters.rateCenterGroup.city.should.equal("City1");
        result.supportedRateCenters.rateCenterGroup.state.should.equal("State1");
        done();
      });
    });
    it("should check numbers (with default client and ommited fullCheck)", function(done){
      var numbers = ["1111", "2222"];
      var data = {numberPortabilityRequest: {tnList:{tn: numbers}}};
      var span = helper.nock().post("/accounts/FakeAccountId/lnpchecker?fullCheck=false", helper.buildXml(data)).reply(200, helper.xml.lnpCheck, {"Content-Type": "application/xml"});
      LnpChecker.check(numbers, function(err, result){
        if(err){
          return done(err);
        }
        span.isDone().should.be.true;
        result.supportedRateCenters.rateCenterGroup.rateCenter.should.equal("Center1");
        result.supportedRateCenters.rateCenterGroup.city.should.equal("City1");
        result.supportedRateCenters.rateCenterGroup.state.should.equal("State1");
        done();
      });
    });
  });
});
