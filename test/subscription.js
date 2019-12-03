var lib = require("../");
var helper = require("./helper");
var nock = require("nock");
var Subscription = lib.Subscription;

describe("Subscription", function(){
  before(function(){
    nock.disableNetConnect();
    helper.setupGlobalOptions();
  });
  after(function(){
    nock.cleanAll();
    nock.enableNetConnect();
  });
  describe("#list", function(){
    it("should return list of subscriptions", function(done){
      var span = helper.nock().get("/accounts/FakeAccountId/subscriptions").reply(200, helper.xml.subscriptions, {"Content-Type": "application/xml"});
      Subscription.list(helper.createClient(), function(err, list){
        if(err){
          return done(err);
        }
        span.isDone().should.be.true;
        list.length.should.equal(1);
        list[0].id.should.equal(1);
        list[0].orderType.should.equal("orders");
        done();
      });
    });
    it("should return list of subscriptions (with default client)", function(done){
      var span = helper.nock().get("/accounts/FakeAccountId/subscriptions").reply(200, helper.xml.subscriptions, {"Content-Type": "application/xml"});
      Subscription.list(function(err, list){
        if(err){
          return done(err);
        }
        span.isDone().should.be.true;
        list.length.should.equal(1);
        list[0].id.should.equal(1);
        list[0].orderType.should.equal("orders");
        done();
      });
    });

    it("should fail for error status code", function(done){
      helper.nock().get("/accounts/FakeAccountId/subscriptions").reply(400);
      Subscription.list(helper.createClient(), function(err, list){
        if(err){
          return done();
        }
        done(new Error("An error is estimated"));
      });
    });
  });
  describe("#get", function(){
    it("should return a subscription", function(done){
      var span = helper.nock().get("/accounts/FakeAccountId/subscriptions/1").reply(200, helper.xml.subscriptions, {"Content-Type": "application/xml"});
      Subscription.get(helper.createClient(), "1",  function(err, item){
        if(err){
          return done(err);
        }
        span.isDone().should.be.true;
        item.id.should.equal(1);
        item.orderType.should.equal("orders");
        done();
      });
    });
    it("should return a subscription (with default client)", function(done){
      var span = helper.nock().get("/accounts/FakeAccountId/subscriptions/1").reply(200, helper.xml.subscriptions, {"Content-Type": "application/xml"});
      Subscription.get(1,  function(err, item){
        if(err){
          return done(err);
        }
        span.isDone().should.be.true;
        item.id.should.equal(1);
        item.orderType.should.equal("orders");
        done();
      });
    });
    it("should fail for error status code", function(done){
      var span = helper.nock().get("/accounts/FakeAccountId/subscriptions/1").reply(400);
      Subscription.get(helper.createClient(), "1",  function(err, item){
        if(err){
          return done();
        }
        done(new Error("An error is estimated"));
      });
    });
  });
  describe("#create", function(){
    it("should create a subscription", function(done){
      var data = {name: "Test Subscription", description: "A Site Description"};
      helper.nock().post("/accounts/FakeAccountId/subscriptions", helper.buildXml({subscription: data})).reply(201, "", {"Location": "/accounts/FakeAccountId/subscriptions/1"});
      helper.nock().get("/accounts/FakeAccountId/subscriptions/1").reply(200, helper.xml.subscriptions, {"Content-Type": "application/xml"});
      Subscription.create(helper.createClient(), data,  function(err, item){
        if(err){
          return done(err);
        }
        item.id.should.equal(1);
        item.orderType.should.equal("orders");
        done();
      });
    });
    it("should create a subscription (with default client)", function(done){
      var data = {name: "Test Subscription", description: "A Site Description"};
      helper.nock().post("/accounts/FakeAccountId/subscriptions", helper.buildXml({subscription: data})).reply(201, "", {"Location": "/accounts/FakeAccountId/subscriptions/1"});
      helper.nock().get("/accounts/FakeAccountId/subscriptions/1").reply(200, helper.xml.subscriptions, {"Content-Type": "application/xml"});
      Subscription.create(data,  function(err, item){
        if(err){
          return done(err);
        }
        item.id.should.equal(1);
        item.orderType.should.equal("orders");
        done();
      });
    });
    it("should fail on error status code", function(done){
      var data = {name: "Test Subscription", description: "A Site Description"};
      helper.nock().post("/accounts/FakeAccountId/subscriptions").reply(400, "");
      Subscription.create(helper.createClient(), data,  function(err, item){
        if(err){
          return done();
        }
        done(new Error("An error is expected"));
      });
    });
  });
  describe("#update", function(){
    it("should update a subscription", function(done){
      var data = {name: "Test Subscription" };
      helper.nock().put("/accounts/FakeAccountId/subscriptions/1", helper.buildXml({subscription: data})).reply(200);
      var subscription = new Subscription();
      subscription.id = 1;
      subscription.client = helper.createClient();
      subscription.update(data, done);
    });
  });
  describe("#delete", function(){
    it("should delete a subscription", function(done){
      helper.nock().delete("/accounts/FakeAccountId/subscriptions/1").reply(200);
      var subscription = new Subscription();
      subscription.id = 1;
      subscription.client = helper.createClient();
      subscription.delete(done);
    });
  });
});
