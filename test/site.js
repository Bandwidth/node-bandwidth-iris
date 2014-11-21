var lib = require("../lib");
var helper = require("./helper");
var nock = require("nock");
var Site = lib.Site;

describe("Site", function(){
  before(function(){
    nock.disableNetConnect();
    helper.setupEnvironmentVariables();
  });
  after(function(){
    nock.cleanAll();
    nock.enableNetConnect();
  });
  describe("#list", function(){
    it("should return list of sites", function(done){
      var span = helper.nock().get("/v1.0/accounts/FakeAccountId/sites").reply(200, helper.xml.sites, {"Content-Type": "application/xml"});
      Site.list(helper.createClient(), function(err, list){
        if(err){
          return done(err);
        }
        span.isDone().should.be.true;
        list.length.should.equal(1);
        list[0].id.should.equal(1);
        list[0].name.should.equal("Test Site");
        list[0].description.should.equal("A site description");
        done();
      });
    });
    it("should return list of sites (with default client)", function(done){
      var span = helper.nock().get("/v1.0/accounts/FakeAccountId/sites").reply(200, helper.xml.sites, {"Content-Type": "application/xml"});
      Site.list(function(err, list){
        if(err){
          return done(err);
        }
        span.isDone().should.be.true;
        list.length.should.equal(1);
        list[0].id.should.equal(1);
        list[0].name.should.equal("Test Site");
        list[0].description.should.equal("A site description");
        done();
      });
    });
  });
  describe("#get", function(){
    it("should return a site", function(done){
      var span = helper.nock().get("/v1.0/accounts/FakeAccountId/sites/1").reply(200, helper.xml.site, {"Content-Type": "application/xml"});
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
      var span = helper.nock().get("/v1.0/accounts/FakeAccountId/sites/1").reply(200, helper.xml.site, {"Content-Type": "application/xml"});
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
  });
  describe("#create", function(){
    it("should create a  site", function(done){
      var data = {name: "Test Site", description: "A Site Description"};
      helper.nock().post("/v1.0/accounts/FakeAccountId/sites", helper.buildXml({site: data})).reply(201, "", {"Location": "/v1.0/accounts/FakeAccountId/sites/1"});
      helper.nock().get("/v1.0/accounts/FakeAccountId/sites/1").reply(200, helper.xml.site, {"Content-Type": "application/xml"});
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
      helper.nock().post("/v1.0/accounts/FakeAccountId/sites", helper.buildXml({site: data})).reply(201, "", {"Location": "/v1.0/accounts/FakeAccountId/sites/1"});
      helper.nock().get("/v1.0/accounts/FakeAccountId/sites/1").reply(200, helper.xml.site, {"Content-Type": "application/xml"});
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
  });
  describe("#update", function(){
    it("should update a site", function(done){
      var data = {name: "Test Site" };
      helper.nock().put("/v1.0/accounts/FakeAccountId/sites/1", helper.buildXml({site: data})).reply(200);
      var site = new Site();
      site.id = 1;
      site.client = helper.createClient();
      site.update(data, done);
    });
  });
  describe("#delete", function(){
    it("should delete a site", function(done){
      helper.nock().delete("/v1.0/accounts/FakeAccountId/sites/1").reply(200);
      var site = new Site();
      site.id = 1;
      site.client = helper.createClient();
      site.delete(done);
    });
  });
});
