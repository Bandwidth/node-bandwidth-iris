var lib = require("../");
var helper = require("./helper");
var nock = require("nock");
var Account = lib.Account;

describe("Account", function(){
  before(function(){
    nock.disableNetConnect();
    helper.setupGlobalOptions();
  });
  after(function(){
    nock.cleanAll();
    nock.enableNetConnect();
  });
  describe("#get", function(){
    it("should return account", function(done){
      helper.nock().get("/v1.0/accounts/FakeAccountId").reply(200, helper.xml.account, {"Content-Type": "application/xml"});
      Account.get(helper.createClient(), function(err, account){
        if(err){
          return done(err);
        }
        account.accountId.should.eql(14);
        done();
      });
    });
  });
});
