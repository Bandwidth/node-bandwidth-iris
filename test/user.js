var lib = require("../");
var helper = require("./helper");
var nock = require("nock");
var User = lib.User;

describe("User", function(){
  before(function(){
    nock.disableNetConnect();
    helper.setupGlobalOptions();
  });
  after(function(){
    nock.cleanAll();
    nock.enableNetConnect();
  });
  describe("#list", function(){
    it("should return list of users", function(done){
      var span = helper.nock().get("/users").reply(200, helper.xml.users, {"Content-Type": "application/xml"});
      User.list(helper.createClient(), function(err, list){
        if(err){
          return done(err);
        }
        span.isDone().should.be.true;
        list.length.should.equal(2);
        list[0].firstName.should.equal("Jane");
        list[0].username.should.equal("testcustomer");
        done();
      });
    });
    it("should return list of sites (with default client)", function(done){
      var span = helper.nock().get("/users").reply(200, helper.xml.users, {"Content-Type": "application/xml"});
      User.list(function(err, list){
        if(err){
          return done(err);
        }
        span.isDone().should.be.true;
        list.length.should.equal(2);
        list[0].firstName.should.equal("Jane");
        list[0].username.should.equal("testcustomer");
        done();
      });
    });
  });
});
