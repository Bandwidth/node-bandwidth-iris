var lib = require("../");
var helper = require("./helper");
var nock = require("nock");
var InServiceNumber = lib.InServiceNumber;

describe("In Service Number", function(){
  before(function(){
    nock.disableNetConnect();
    helper.setupGlobalOptions();
  });
  after(function(){
    nock.cleanAll();
    nock.enableNetConnect();
  });
  describe("#list", function(){
    it("should return numbers", function(done){
      helper.nock().get("/accounts/FakeAccountId/inserviceNumbers").reply(200, helper.xml.inServiceNumbers, {"Content-Type": "application/xml"});
      InServiceNumber.list(helper.createClient(), {}, function(err, res){
        if(err){
          return done(err);
        }
        res.totalCount.should.eql(59);
        res.telephoneNumbers.telephoneNumber[0].should.eql("8043024183");
        done();
      });
    });
  });
  describe("#totals", function(){
    it("should return totals", function(done){
      helper.nock().get("/accounts/FakeAccountId/inserviceNumbers/totals").reply(200, helper.xml.inServiceNumbersTotals, {"Content-Type": "application/xml"});
      InServiceNumber.totals(helper.createClient(), function(err, res){
        if(err){
          return done(err);
        }
        res.count.should.eql(3);
        done();
      });
    });
  });
  describe("#get tn", function(){
    it("should return tn result", function(done){
      helper.nock().get("/accounts/FakeAccountId/inserviceNumbers/9195551212").reply(200);
      InServiceNumber.get(helper.createClient(), "9195551212", function(err, res){
        if(err){
          return done(err);
        }
        done();
      });
    });
  });
});
