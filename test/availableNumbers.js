var lib = require("../");
var helper = require("./helper");
var nock = require("nock");
var AvailableNumbers = lib.AvailableNumbers;
debugger;
describe("AvailableNumbers", function(){
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
      helper.nock().get("/accounts/FakeAccountId/availableNumbers?areaCode=866&quantity=5").reply(200, helper.xml.availableNumbers, {"Content-Type": "application/xml"});
      AvailableNumbers.list(helper.createClient(), {areaCode: 866, quantity: 5}, function(err, res){
        if(err){
          return done(err);
        }
        var list = res.telephoneNumberDetailList.telephoneNumberDetail;
        list.should.eql([ { city: "JERSEY CITY",
              lata: 224,
              rateCenter: "JERSEYCITY",
              state: "NJ",
              telephoneNumber: "2012001555" },
                { city: "JERSEY CITY",
                      lata: 224,
              rateCenter: "JERSEYCITY",
              state: "NJ",
              telephoneNumber: 123123123 } ] );
        done();
      });
    });
    it("should return numbers (with default client)", function(done){
      helper.nock().get("/accounts/FakeAccountId/availableNumbers?areaCode=866&quantity=5").reply(200, helper.xml.availableNumbers, {"Content-Type": "application/xml"});
      AvailableNumbers.list({areaCode: 866, quantity: 5}, function(err, res){
        if(err){
          return done(err);
        }
        var list = res.telephoneNumberDetailList.telephoneNumberDetail;
        list.should.eql([ { city: "JERSEY CITY",
              lata: 224,
              rateCenter: "JERSEYCITY",
              state: "NJ",
              telephoneNumber: "2012001555" },
                { city: "JERSEY CITY",
                      lata: 224,
              rateCenter: "JERSEYCITY",
              state: "NJ",
              telephoneNumber: 123123123 } ] );
        done();
      });
    });
  });
});
