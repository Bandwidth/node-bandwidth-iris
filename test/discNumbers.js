var lib = require("../");
var helper = require("./helper");
var nock = require("nock");
var DiscNumber = lib.DiscNumber;

describe("DiscNumbers", function(){
  before(function(){
    nock.disableNetConnect();
    helper.setupGlobalOptions();
  });
  after(function(){
    nock.cleanAll();
    nock.enableNetConnect();
  });
  describe("#list", function(){
    it("should return disc numbers", function(done){
      helper.nock().get("/accounts/FakeAccountId/discnumbers").reply(200, helper.xml.discNumbers, {"Content-Type": "application/xml"});
      DiscNumber.list(helper.createClient(), {}, function(err, res){
        if(err){
          return done(err);
        }
        res.count.should.eql(2);
        res.telephoneNumber.length.should.eql(2);
        done();
      });
    });
  });
});
