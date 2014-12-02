var lib = require("../");
var helper = require("./helper");
var nock = require("nock");
var RateCenter = lib.RateCenter;

describe("RateCenter", function(){
  before(function(){
    nock.disableNetConnect();
    helper.setupGlobalOptions();
  });
  after(function(){
    nock.cleanAll();
    nock.enableNetConnect();
  });
  describe("#list", function(){
    it("should return list of rateCenters", function(done){
      var span = helper.nock().get("/v1.0/rateCenters").reply(200, helper.xml.rateCenters, {"Content-Type": "application/xml"});
      RateCenter.list(helper.createClient(), function(err, list){
        if(err){
          return done(err);
        }
        span.isDone().should.be.true;
        list.length.should.equal(3);
        list[0].name.should.equal("ACME");
        list[0].abbreviation.should.equal("ACME");
        new RateCenter();
        done();
      });
    });
    it("should return list of rateCenters (with default client)", function(done){
      var span = helper.nock().get("/v1.0/rateCenters").reply(200, helper.xml.rateCenters, {"Content-Type": "application/xml"});
      RateCenter.list(function(err, list){
        if(err){
          return done(err);
        }
        span.isDone().should.be.true;
        list.length.should.equal(3);
        list[0].name.should.equal("ACME");
        list[0].abbreviation.should.equal("ACME");
        done();
      });
    });

    it("should fail for error status code", function(done){
      helper.nock().get("/v1.0/rateCenters").reply(400);
      RateCenter.list(helper.createClient(), function(err, list){
        if(err){
          return done();
        }
        done(new Error("An error is estimated"));
      });
    });
  });
});
