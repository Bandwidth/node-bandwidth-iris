var lib = require("../");
var helper = require("./helper");
var nock = require("nock");
var AvailableNpaNxx = lib.AvailableNpaNxx;
describe("AvailableNpaNxx", function(){
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
      helper.nock().get("/accounts/FakeAccountId/availableNpaNxx?areaCode=919").reply(200, helper.xml.availableNpaNxx, {"Content-Type": "application/xml"});
      AvailableNpaNxx.list(helper.createClient(), {areaCode: 919}, function(err, items){
        if(err){
          return done(err);
        }
        items.should.eql([ { city: "City1",
              state: "State1",
              npa: "Npa1",
              nxx: "Nxx1",
              quantity: 10 }, {
              city: "City2",
              state: "State2",
              npa: "Npa2",
              nxx: "Nxx2",
              quantity: 20 } ]
              );
        done();
      });
    });
    it("should return numbers (with default client)", function(done){
      helper.nock().get("/accounts/FakeAccountId/availableNpaNxx?areaCode=919").reply(200, helper.xml.availableNpaNxx, {"Content-Type": "application/xml"});
      AvailableNpaNxx.list({areaCode: 919}, function(err, items){
        if(err){
          return done(err);
        }
        items.should.eql([ { city: "City1",
              state: "State1",
              npa: "Npa1",
              nxx: "Nxx1",
              quantity: 10 }, {
              city: "City2",
              state: "State2",
              npa: "Npa2",
              nxx: "Nxx2",
              quantity: 20 } ]
              );
        done();
      });
    });
    it("should fail on error status code", function(done){
      helper.nock().get("/accounts/FakeAccountId/availableNpaNxx?areaCode=919").reply(400);
      AvailableNpaNxx.list(helper.createClient(), {areaCode: 919}, function(err, items){
        if(err){
          return done();
        }
        done(new Error("An error is estimated"));
      });
    });
  });
});
