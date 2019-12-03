var lib = require("../");
var helper = require("./helper");
var nock = require("nock");
var Site = lib.Site;

describe("Site", function(){
  before(function(){
    nock.disableNetConnect();
    helper.setupGlobalOptions();
  });
  after(function(){
    nock.cleanAll();
    nock.enableNetConnect();
  });
  describe("#list", function(){
    it("should return list of sites", function(done){
      var span = helper.nock().get("/accounts/FakeAccountId/sites").reply(200, helper.xml.sites, {"Content-Type": "application/xml"});
      Site.list(helper.createClient(), function(err, list){
        if(err){
          return done(err);
        }
        span.isDone().should.be.true;
        list.length.should.equal(2);
        list[0].id.should.equal(1);
        list[0].name.should.equal("Test Site");
        list[0].description.should.equal("A site description");
        done();
      });
    });
    it("should return list of sites (with default client)", function(done){
      var span = helper.nock().get("/accounts/FakeAccountId/sites").reply(200, helper.xml.sites, {"Content-Type": "application/xml"});
      Site.list(function(err, list){
        if(err){
          return done(err);
        }
        span.isDone().should.be.true;
        list.length.should.equal(2);
        list[0].id.should.equal(1);
        list[0].name.should.equal("Test Site");
        list[0].description.should.equal("A site description");
        done();
      });
    });

    it("should fail for error status code", function(done){
      helper.nock().get("/accounts/FakeAccountId/sites").reply(400);
      Site.list(helper.createClient(), function(err, list){
        if(err){
          return done();
        }
        done(new Error("An error is estimated"));
      });
    });
  });
  describe("#get", function(){
    it("should return a site", function(done){
      var span = helper.nock().get("/accounts/FakeAccountId/sites/1").reply(200, helper.xml.site, {"Content-Type": "application/xml"});
      Site.get(helper.createClient(), "1",  function(err, item){
        if(err){
          return done(err);
        }
        span.isDone().should.be.true;
        item.id.should.equal(1);
        item.name.should.equal("Test Site");
        item.description.should.equal("A Site Description");
        done();
      });
    });
    it("should return a site (with default client)", function(done){
      var span = helper.nock().get("/accounts/FakeAccountId/sites/1").reply(200, helper.xml.site, {"Content-Type": "application/xml"});
      Site.get(1,  function(err, item){
        if(err){
          return done(err);
        }
        span.isDone().should.be.true;
        item.id.should.equal(1);
        item.name.should.equal("Test Site");
        item.description.should.equal("A Site Description");
        done();
      });
    });
    it("should fail for error status code", function(done){
      var span = helper.nock().get("/accounts/FakeAccountId/sites/1").reply(400);
      Site.get(helper.createClient(), "1",  function(err, item){
        if(err){
          return done();
        }
        done(new Error("An error is estimated"));
      });
    });
  });
  describe("#create", function(){
    it("should create a  site", function(done){
      var data = {name: "Test Site", description: "A Site Description"};
      helper.nock().post("/accounts/FakeAccountId/sites", helper.buildXml({site: data})).reply(201, "", {"Location": "/accounts/FakeAccountId/sites/1"});
      helper.nock().get("/accounts/FakeAccountId/sites/1").reply(200, helper.xml.site, {"Content-Type": "application/xml"});
      Site.create(helper.createClient(), data,  function(err, item){
        if(err){
          return done(err);
        }
        item.id.should.equal(1);
        item.name.should.equal("Test Site");
        item.description.should.equal("A Site Description");
        done();
      });
    });
    it("should create a  site (with default client)", function(done){
      var data = {name: "Test Site", description: "A Site Description"};
      helper.nock().post("/accounts/FakeAccountId/sites", helper.buildXml({site: data})).reply(201, "", {"Location": "/accounts/FakeAccountId/sites/1"});
      helper.nock().get("/accounts/FakeAccountId/sites/1").reply(200, helper.xml.site, {"Content-Type": "application/xml"});
      Site.create(data,  function(err, item){
        if(err){
          return done(err);
        }
        item.id.should.equal(1);
        item.name.should.equal("Test Site");
        item.description.should.equal("A Site Description");
        done();
      });
    });
    it("should fail on error status code", function(done){
      var data = {name: "Test Site", description: "A Site Description"};
      helper.nock().post("/accounts/FakeAccountId/sites").reply(400, "");
      Site.create(helper.createClient(), data,  function(err, item){
        if(err){
          return done();
        }
        done(new Error("An error is expected"));
      });
    });
  });
  describe("#update", function(){
    it("should update a site", function(done){
      var data = {name: "Test Site" };
      helper.nock().put("/accounts/FakeAccountId/sites/1", helper.buildXml({site: data})).reply(200);
      var site = new Site();
      site.id = 1;
      site.client = helper.createClient();
      site.update(data, done);
    });
  });
  describe("#delete", function(){
    it("should delete a site", function(done){
      helper.nock().delete("/accounts/FakeAccountId/sites/1").reply(200);
      var site = new Site();
      site.id = 1;
      site.client = helper.createClient();
      site.delete(done);
    });
  });
  describe("#getSipPeers", function(){
    it("should return list of sippeers", function(done){
      var span = helper.nock().get("/accounts/FakeAccountId/sites/1/sippeers").reply(200, helper.xml.sipPeers, {"Content-Type": "application/xml"});
      var site = new Site();
      site.client = helper.createClient();
      site.id = "1";
      site.getSipPeers(function(err, list){
        if(err){
          return done(err);
        }
        span.isDone().should.be.true;
        list.length.should.equal(1);
        list[0].id.should.equal(12345);
        list[0].peerName.should.equal("SIP Peer 1");
        list[0].description.should.equal("Sip Peer 1 description");
        done();
      });
    });
    it("should fail on error status code", function(done){
      helper.nock().get("/accounts/FakeAccountId/sites/1/sippeers").reply(400);
      var site = new Site();
      site.client = helper.createClient();
      site.id = "1";
      site.getSipPeers(function(err, list){
        if(err){
          return done();
        }
        done(new Error("An error is expected"));
      });
    });
  });
  describe("#getSipPeer", function(){
    it("should return a sip peer", function(done){
      var span = helper.nock().get("/accounts/FakeAccountId/sites/1/sippeers/10").reply(200, helper.xml.sipPeer, {"Content-Type": "application/xml"});
      var site = new Site();
      site.client = helper.createClient();
      site.id = "1";
      site.getSipPeer("10", function(err, item){
        if(err){
          return done(err);
        }
        span.isDone().should.be.true;
        item.id.should.equal(10);
        item.peerName.should.equal("SIP Peer 1");
        item.description.should.equal("Sip Peer 1 description");
        done();
      });
    });
    it("should fail on error status code", function(done){
      helper.nock().get("/accounts/FakeAccountId/sites/1/sippeers/10").reply(400);
      var site = new Site();
      site.client = helper.createClient();
      site.id = "1";
      site.getSipPeer("10", function(err, item){
        if(err){
          return done();
        }
        done(new Error("An error is expected"));
      });
    });
  });
  describe("#createSipPeer", function(){
    it("should create a sip peer", function(done){
      var data = {peerName: "SIP Peer 1", description: "Sip Peer 1 description"};
      helper.nock().post("/accounts/FakeAccountId/sites/1/sippeers", helper.buildXml({sipPeer: data})).reply(201, "", {"Location": "/accounts/FakeAccountId/sites/1/sippeers/10"});
      helper.nock().get("/accounts/FakeAccountId/sites/1/sippeers/10").reply(200, helper.xml.sipPeer, {"Content-Type": "application/xml"});
      var site = new Site();
      site.client = helper.createClient();
      site.id = "1";
      site.createSipPeer(data, function(err, item){
        if(err){
          return done(err);
        }
        item.id.should.equal(10);
        item.peerName.should.equal("SIP Peer 1");
        item.description.should.equal("Sip Peer 1 description");
        done();
      });
    });
    it("fail on error status code", function(done){
      var data = {peerName: "SIP Peer 1", description: "Sip Peer 1 description"};
      helper.nock().post("/accounts/FakeAccountId/sites/1/sippeers").reply(400, "<Response><ErrorCode>400</ErrorCode><Description>Error</Description></Response>");
      var site = new Site();
      site.client = helper.createClient();
      site.id = "1";
      site.createSipPeer(data, function(err, item){
        if(err){
          return done();
        }
        done(new Error("An error is expected"));
      });
    });
  });
  describe("#getOrders", function(done){
    it("should get a list of orders", function(done){
      helper.nock().get("/accounts/FakeAccountId/sites/1/orders").reply(200, helper.xml.siteOrders, {"Content-Type": "application/xml"});
      var site = new Site();
      site.id = "1";
      site.client = helper.createClient();
      site.getOrders({}, function(err,res){
        if(err){
          return done(err);
        }
        res.should.be.ok;
        done();
      })
    });
  });
  describe("#getInserviceNumbers", function(done){
    it("should get a list of inservice numbers", function(done){
      helper.nock().get("/accounts/FakeAccountId/sites/1/inserviceNumbers").reply(200, helper.xml.inServiceNumbers, {"Content-Type": "application/xml"});
      var site = new Site();
      site.id = "1";
      site.client = helper.createClient();
      site.getInserviceNumbers({}, function(err,res){
        if(err){
          return done(err);
        }
        res.should.be.ok;
        done();
      })
    });
  });


});
