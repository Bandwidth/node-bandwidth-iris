var lib = require("../");
var helper = require("./helper");
var nock = require("nock");
var SipPeer = lib.SipPeer;

describe("SipPeer", function(){
  before(function(){
    nock.disableNetConnect();
    helper.setupEnvironmentVariables();
  });
  after(function(){
    nock.cleanAll();
    nock.enableNetConnect();
  });
  describe("#list", function(){
    it("should return list of peers", function(done){
      var span = helper.nock().get("/v1.0/accounts/FakeAccountId/sites/1/sippeers").reply(200, helper.xml.sipPeers, {"Content-Type": "application/xml"});
      SipPeer.list(helper.createClient(), 1, function(err, list){
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
    it("should return list of peers with default client", function(done){
      var span = helper.nock().get("/v1.0/accounts/FakeAccountId/sites/1/sippeers").reply(200, helper.xml.sipPeers, {"Content-Type": "application/xml"});
      SipPeer.list(1, function(err, list){
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
  });
  describe("#get", function(){
    it("should return a peer", function(done){
      var span = helper.nock().get("/v1.0/accounts/FakeAccountId/sites/1/sippeers/10").reply(200, helper.xml.sipPeer, {"Content-Type": "application/xml"});
      SipPeer.get(helper.createClient(), 1, 10, function(err, item){
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
    it("should return a peer with default client", function(done){
      var span = helper.nock().get("/v1.0/accounts/FakeAccountId/sites/1/sippeers/10").reply(200, helper.xml.sipPeer, {"Content-Type": "application/xml"});
      SipPeer.get(1, 10, function(err, item){
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
  });
  describe("#create", function(){
    it("should create a sip peer", function(done){
      var data = {peerName: "SIP Peer 1", description: "Sip Peer 1 description", siteId: 1};
      helper.nock().post("/v1.0/accounts/FakeAccountId/sites/1/sippeers", helper.buildXml({sipPeer: data})).reply(201, "", {"Location": "/v1.0/accounts/FakeAccountId/sites/1/sippeers/10"});
      helper.nock().get("/v1.0/accounts/FakeAccountId/sites/1/sippeers/10").reply(200, helper.xml.sipPeer, {"Content-Type": "application/xml"});
      SipPeer.create(helper.createClient(), data, function(err, item){
        if(err){
          return done(err);
        }
        item.id.should.equal(10);
        item.peerName.should.equal("SIP Peer 1");
        item.description.should.equal("Sip Peer 1 description");
        done();
      });
    });
    it("should create a sip peer with default client", function(done){
      var data = {peerName: "SIP Peer 1", description: "Sip Peer 1 description", siteId: 1};
      helper.nock().post("/v1.0/accounts/FakeAccountId/sites/1/sippeers", helper.buildXml({sipPeer: data})).reply(201, "", {"Location": "/v1.0/accounts/FakeAccountId/sites/1/sippeers/10"});
      helper.nock().get("/v1.0/accounts/FakeAccountId/sites/1/sippeers/10").reply(200, helper.xml.sipPeer, {"Content-Type": "application/xml"});
      SipPeer.create(data, function(err, item){
        if(err){
          return done(err);
        }
        item.id.should.equal(10);
        item.peerName.should.equal("SIP Peer 1");
        item.description.should.equal("Sip Peer 1 description");
        done();
      });
    });
  });
  describe("#delete", function(){
    it("should remove a peer", function(done){
      helper.nock().delete("/v1.0/accounts/FakeAccountId/sites/1/sippeers/10").reply(200);
      var peer = new SipPeer();
      peer.client = helper.createClient();
      peer.siteId = 1;
      peer.id = 10;
      peer.delete(done);
    });
    it("should fail for error status code", function(done){
      helper.nock().delete("/v1.0/accounts/FakeAccountId/sites/1/sippeers/10").reply(400);
      var peer = new SipPeer();
      peer.client = helper.createClient();
      peer.siteId = 1;
      peer.id = 10;
      peer.delete(function(err){
        if(err){
          return done();
        }
        done(new Error("An error is estimated"));
      });
    });
  });
  describe("#getTns", function(){
    it("should return list of numbers", function(done){
      var span = helper.nock().get("/v1.0/accounts/FakeAccountId/sites/1/sippeers/10/tns").reply(200, helper.xml.tns, {"Content-Type": "application/xml"});
      var peer = new SipPeer();
      peer.id = 10;
      peer.siteId = 1;
      peer.client = helper.createClient();
      peer.getTns(function(err, list){
        if(err){
          return done(err);
        }
        span.isDone().should.be.true;
        list.length.should.equal(17);
        list[0].fullNumber.should.equal("3034162216");
        done();
      });
    });

    it("should return a number", function(done){
      var span = helper.nock().get("/v1.0/accounts/FakeAccountId/sites/1/sippeers/10/tns/12345").reply(200, helper.xml.tn, {"Content-Type": "application/xml"});
      var peer = new SipPeer();
      peer.id = 10;
      peer.siteId = 1;
      peer.client = helper.createClient();
      peer.getTns("12345", function(err, item){
        if(err){
          return done(err);
        }
        span.isDone().should.be.true;
        item.fullNumber.should.equal("9195551212");
        done();
      });
    });

    it("should fail for error status code", function(done){
      helper.nock().get("/v1.0/accounts/FakeAccountId/sites/1/sippeers/10/tns/12345").reply(400);
      var peer = new SipPeer();
      peer.id = 10;
      peer.siteId = 1;
      peer.client = helper.createClient();
      peer.getTns("12345", function(err, item){
        if(err){
          return done();
        }
        done(new Error("An error is estimated"));
      });
    });
  });
  describe("#updateTns", function(){
    it("should update a number", function(done){
      var data = {fullNumber: "123456", rewriteUser: "test"};
      var span = helper.nock().put("/v1.0/accounts/FakeAccountId/sites/1/sippeers/10/tns/12345", helper.buildXml({sipPeerTelephoneNumber: data})).reply(200);
      var peer = new SipPeer();
      peer.id = 10;
      peer.siteId = 1;
      peer.client = helper.createClient();
      peer.updateTns("12345", data, done);
    });
  });
  describe("#moveTns", function(){
    it("should move numbers", function(done){
      var data = ["111", "222"];
      var span = helper.nock().post("/v1.0/accounts/FakeAccountId/sites/1/sippeers/10/movetns", helper.buildXml({sipPeerTelephoneNumbers: {fullNumber: data}})).reply(200);
      var peer = new SipPeer();
      peer.id = 10;
      peer.siteId = 1;
      peer.client = helper.createClient();
      peer.moveTns(data, done);
    });
  });
});
