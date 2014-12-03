var lib = require("../");
var helper = require("./helper");
var nock = require("nock");
var os = require("os");
var path = require("path");
var fs = require("fs");
var Order = lib.Order;

describe("Order", function(){
  before(function(){
    nock.disableNetConnect();
    helper.setupGlobalOptions();
  });
  after(function(){
    nock.cleanAll();
    nock.enableNetConnect();
  });
  describe("#create", function(){
    it("should create an order", function(done){
      var data = {
        name: "Test",
        siteId: "10",
        customerOrderId: "11",
        lataSearchAndOrderType: {
          lata: "224",
          quantity: 1
        }
      };
      helper.nock().post("/v1.0/accounts/FakeAccountId/orders", helper.buildXml({order: data})).reply(200, helper.xml.order);
      Order.create(helper.createClient(), data, function(err, item){
        if(err){
          return done(err);
        }
        var order = item.order;
        order.id.should.equal(101);
        order.name.should.equal("Test");
        done();
      });
    });
    it("should create an order (with default client)", function(done){
      var data = {
        name: "Test",
        siteId: "10",
        customerOrderId: "11",
        lataSearchAndOrderType: {
          lata: "224",
          quantity: 1
        }
      };
      helper.nock().post("/v1.0/accounts/FakeAccountId/orders", helper.buildXml({order: data})).reply(200, helper.xml.order);
      Order.create(data, function(err, item){
        if(err){
          return done(err);
        }
        var order = item.order;
        order.id.should.equal(101);
        order.name.should.equal("Test");
        done();
      });
    });
    it("should fail on error status code", function(done){
      var data = {
        name: "Test",
        siteId: "10",
        customerOrderId: "11",
        lataSearchAndOrderType: {
          lata: "224",
          quantity: 1
        }
      };
      helper.nock().post("/v1.0/accounts/FakeAccountId/orders").reply(400, "");
      Order.create(helper.createClient(), data,  function(err, item){
        if(err){
          return done();
        }
        done(new Error("An error is expected"));
      });
    });
  });
  describe("#get", function(){
    it("should get an order", function(done){
      helper.nock().get("/v1.0/accounts/FakeAccountId/orders/101").reply(200, helper.xml.order);
      Order.get(helper.createClient(), "101", function(err, item){
        if(err){
          return done(err);
        }
        var order = item.order;
        order.id.should.equal(101);
        order.name.should.equal("Test");
        done();
      });
    });
    it("should get an order (with default client)", function(done){
      helper.nock().get("/v1.0/accounts/FakeAccountId/orders/101").reply(200, helper.xml.order);
      Order.get(helper.createClient(), "101", function(err, item){
        if(err){
          return done(err);
        }
        var order = item.order;
        order.id.should.equal(101);
        order.name.should.equal("Test");
        done();
      });
    });
    it("should fail on error status code", function(done){
      helper.nock().get("/v1.0/accounts/FakeAccountId/orders/101").reply(400, "");
      Order.get(helper.createClient(), "101", function(err, item){
        if(err){
          return done();
        }
        done(new Error("An error is expected"));
      });
    });
  });
  describe("#update", function(){
    it("should update a order", function(done){
      var data = {
        name: "Test",
        closeOrder: true
      };
      helper.nock().put("/v1.0/accounts/FakeAccountId/orders/101", helper.buildXml({order: data})).reply(200);
      var order = new Order();
      order.id = 101;
      order.client = helper.createClient();
      order.update(data, done);
    });
  });
  describe("#getNotes", function(){
    it("should return notes", function(done){
      helper.nock().get("/v1.0/accounts/FakeAccountId/orders/1/notes").reply(200, helper.xml.notes, {"Content-Type": "application/xml"});
      var order = new Order();
      order.id = 1;
      order.client = helper.createClient();
      order.getNotes(function(err, notes){
        if(err){
          return done(err);
        }
        notes.length.should.equal(2);
        notes[0].id.should.equal(11299);
        notes[0].userId.should.equal("customer");
        notes[0].description.should.equal("Test");
        done();
      });
    });
    it("should fail for error status code", function(done){
      helper.nock().get("/v1.0/accounts/FakeAccountId/orders/1/notes").reply(400);
      var order = new Order();
      order.id = 1;
      order.client = helper.createClient();
      order.getNotes(function(err, notes){
        if(err){
          return done();
        }
        done(new Error("An error is estimated"));
      });
    });
  });
  describe("#addNote", function(){
    it("should add new note", function(done){
      var data = {userId: "customer", description: "Test"};
      helper.nock().post("/v1.0/accounts/FakeAccountId/orders/1/notes", helper.buildXml({note: data})).reply(200, "", {"Location": "/v1.0/accounts/FakeAccountId/portins/1/notes/11299"});
      helper.nock().get("/v1.0/accounts/FakeAccountId/orders/1/notes").reply(200, helper.xml.notes, {"Content-Type": "application/xml"});
      var order = new Order();
      order.id = 1;
      order.client = helper.createClient();
      order.addNote(data, function(err, note){
        if(err){
          return done(err);
        }
        note.id.should.equal(11299);
        note.userId.should.equal("customer");
        note.description.should.equal("Test");
        done();
      });
    });
    it("should fail on loading notes error", function(done){
      var data = {userId: "customer", description: "Test"};
      helper.nock().post("/v1.0/accounts/FakeAccountId/orders/1/notes", helper.buildXml({note: data})).reply(200, "", {"Location": "/v1.0/accounts/FakeAccountId/portins/1/notes/11299"});
      helper.nock().get("/v1.0/accounts/FakeAccountId/orders/1/notes").reply(500);
      var order = new Order();
      order.id = 1;
      order.client = helper.createClient();
      order.addNote(data, function(err, note){
        if(err){
          return done();
        }
        done(new Error("An error is estimated"));
      });
    });
    it("should fail on error status code", function(done){
      var data = {userId: "customer", description: "Test"};
      helper.nock().post("/v1.0/accounts/FakeAccountId/orders/1/notes", helper.buildXml({note: data})).reply(400);
      var order = new Order();
      order.id = 1;
      order.client = helper.createClient();
      debugger;
      order.addNote(data, function(err, note){
        if(err){
          return done();
        }
        done(new Error("An error is estimated"));
      });
    });
  });
});
