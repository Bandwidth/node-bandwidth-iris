var lib = require("../");
var helper = require("./helper");
var nock = require("nock");
var Dlda = lib.Dlda;

describe("Dlda", function(){
  before(function(){
    nock.disableNetConnect();
    helper.setupGlobalOptions();
  });
  after(function(){
    nock.cleanAll();
    nock.enableNetConnect();
  });
  describe("#list", function(){
    it("should return a list of Dlda Orders ", function(done){
      helper.nock().get("/accounts/FakeAccountId/dldas").reply(200, helper.xml.dldas, {"Content-Type":"application/xml"});
      Dlda.list(helper.createClient(), {}, function(err,list){
        if(err){
          return done(err);
        }
        list.should.be.ok;
        done();
      });
    });
  });
  describe("#get", function(){
    it("should get dlda successfully", function(done){
      helper.nock().get("/accounts/FakeAccountId/dldas/1").reply(200, helper.xml.dlda, {"Content-Type": "application/xml"});
      Dlda.get(helper.createClient(), "1", function(err, dlda){
        if(err){
          return done(err);
        }
        dlda.should.be.ok;
        dlda.orderId.should.eql("ea9e90c2-77a4-4f82-ac47-e1c5bb1311f4");
        dlda.processingStatus.should.eql("RECEIVED");
        done();
      });
    });
  });
  describe("#create", function(){
    it("should create dlda successfully", function(done){
      var data = {
      }
      helper.nock().post("/accounts/FakeAccountId/dldas", helper.buildXml({dldaOrder: data})).reply(201, "", {"Location": "/accounts/FakeAccountId/dlda/1"});
      helper.nock().get("/accounts/FakeAccountId/dldas/1").reply(200, helper.xml.dlda, {"Content-Type": "application/xml"});
      Dlda.create(helper.createClient(), data, function(err,dlda){
        if(err){
          return done(err);
        }
        dlda.orderId.should.eql("ea9e90c2-77a4-4f82-ac47-e1c5bb1311f4");
        dlda.processingStatus.should.eql("RECEIVED");
        done();
      });
    });
  });
  describe("#getHistory", function(){
    it("should return history", function(done){
      helper.nock().get("/accounts/FakeAccountId/dldas/1/history").reply(200, helper.xml.orderHistory, {"Content-Type": "application/xml"});
      var order = new Dlda();
      order.id = 1;
      order.client = helper.createClient();
      order.getHistory(function(err, history){
        if(err){
          return done(err);
        }
        history.length.should.eql(2);
        done();
      });
    });
  });
});
