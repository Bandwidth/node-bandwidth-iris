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
    it("should get an order (with default client)", function(done){
      helper.nock().get("/v1.0/accounts/FakeAccountId/orders/101").reply(200, helper.xml.order);
      Order.get("101", function(err, item){
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
  describe("#getAreaCodes", function(){
    it("should return areaCodes", function(done){
      helper.nock().get("/v1.0/accounts/FakeAccountId/orders/1/areaCodes").reply(200, helper.xml.orderAreaCodes, {"Content-Type": "application/xml"});
      var order = new Order();
      order.id = 1;
      order.client = helper.createClient();
      order.getAreaCodes(function(err, areaCodes){
        if(err){
          return done(err);
        }
        areaCodes.length.should.equal(1);
        done();
      });
    });
  });
  describe("#getNpaNxx", function(){
    it("should return npaNxx", function(done){
      helper.nock().get("/v1.0/accounts/FakeAccountId/orders/1/npaNxx").reply(200, helper.xml.orderNpaNxx, {"Content-Type": "application/xml"});
      var order = new Order();
      order.id = 1;
      order.client = helper.createClient();
      order.getNpaNxx(function(err, npaNxxs){
        if(err){
          return done(err);
        }
        npaNxxs.length.should.equal(1);
        npaNxxs[0].count.should.eql(1);
        done();
      });
    });
  });
  describe("#getTotals", function(){
    it("should return totals", function(done){
      helper.nock().get("/v1.0/accounts/FakeAccountId/orders/1/totals").reply(200, helper.xml.orderTotals, {"Content-Type": "application/xml"});
      var order = new Order();
      order.id = 1;
      order.client = helper.createClient();
      order.getTotals(function(err, totals){
        if(err){
          return done(err);
        }
        totals.length.should.equal(1);
        totals[0].count.should.eql(1);
        done();
      });
    });
  });
  describe("#getTns", function(){
    it("should return tns", function(done){
      helper.nock().get("/v1.0/accounts/FakeAccountId/orders/1/tns").reply(200, helper.xml.orderTns, {"Content-Type": "application/xml"});
      var order = new Order();
      order.id = 1;
      order.client = helper.createClient();
      order.getTns(function(err, tns){
        if(err){
          return done(err);
        }
        tns.count.should.eql(2);
        tns.telephoneNumber.length.should.eql(2);
        tns.telephoneNumber[0].should.eql("8042105666");
        done();
      });
    });
  });
  describe("#getHistory", function(){
    it("should return history", function(done){
      helper.nock().get("/v1.0/accounts/FakeAccountId/orders/1/history").reply(200, helper.xml.orderHistory, {"Content-Type": "application/xml"});
      var order = new Order();
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
