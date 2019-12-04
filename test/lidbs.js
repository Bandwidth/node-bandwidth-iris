var lib = require("../");
var helper = require("./helper");
var nock = require("nock");
var Lidbs = lib.Lidbs;

describe("Lidbs", function(){
  before(function(){
    nock.disableNetConnect();
    helper.setupGlobalOptions();
  });
  after(function(){
    nock.cleanAll();
    nock.enableNetConnect();
  });
  describe("#list", function(){
    it("should return a list of Lidbs Orders ", function(done){
      helper.nock().get("/accounts/FakeAccountId/lidbs").reply(200, helper.xml.lidbs, {"Content-Type":"application/xml"});
      Lidbs.list(helper.createClient(), {}, function(err,list){
        if(err){
          return done(err);
        }
        list.should.be.ok;
        done();
      });
    });
  });
  describe("#get", function(){
    it("should get Lidbs successfully", function(done){
      helper.nock().get("/accounts/FakeAccountId/lidbs/1").reply(200, helper.xml.lidb, {"Content-Type": "application/xml"});
      Lidbs.get(helper.createClient(), "1", function(err, lidbs){
        if(err){
          return done(err);
        }
        lidbs.should.be.ok;
        lidbs.orderId.should.eql("255bda29-fc57-44e8-a6c2-59b45388c6d0");
        lidbs.processingStatus.should.eql("RECEIVED");
        done();
      });
    });
  });
  describe("#create", function(){
    it("should create lsrOrder successfully", function(done){
      var data = {
        customerOrderId:"A Test order",
        lidbTnGroups:{
          lidbTnGroup:{
            telephoneNumbers:["8048030097", "8045030098"],
            subscriberInformation:"Joes Grarage",
            useType: "RESIDENTIAL",
            visibility: "PUBLIC"
          }
        }
      }
      helper.nock().post("/accounts/FakeAccountId/lidbs", helper.buildXml({lidbOrder: data})).reply(201, "", {"Location": "/accounts/FakeAccountId/lidbs/1"});
      helper.nock().get("/accounts/FakeAccountId/lidbs/1").reply(200, helper.xml.lidb, {"Content-Type": "application/xml"});
      Lidbs.create(helper.createClient(), data, function(err,lidbs){
        if(err){
          return done(err);
        }
        lidbs.orderId.should.eql("255bda29-fc57-44e8-a6c2-59b45388c6d0");
        lidbs.processingStatus.should.eql("RECEIVED");
        done();
      });
    });
  });
});
