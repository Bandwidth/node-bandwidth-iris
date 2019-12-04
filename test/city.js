var lib = require("../");
var helper = require("./helper");
var nock = require("nock");
var City = lib.City;

describe("City", function(){
  before(function(){
    nock.disableNetConnect();
    helper.setupGlobalOptions();
  });
  after(function(){
    nock.cleanAll();
    nock.enableNetConnect();
  });
  describe("#list", function(){
    it("should return cities", function(done){
      helper.nock().get("/cities?state=NC").reply(200, helper.xml.cities, {"Content-Type": "application/xml"});
      City.list(helper.createClient(), {state: "NC"}, function(err, cities){
        if(err){
          return done(err);
        }
        cities.length.should.equal(2);
        cities.should.eql([ { rcAbbreviation: "SOUTHEPINS", name: "ABERDEEN" },
            { rcAbbreviation: "JULIAN", name: "ADVANCE" } ] );
        done();
      });
    });
    it("should return cities (with default client)", function(done){
      helper.nock().get("/cities?state=NC").reply(200, helper.xml.cities, {"Content-Type": "application/xml"});
      City.list({state: "NC"}, function(err, cities){
        if(err){
          return done(err);
        }
        cities.length.should.equal(2);
        cities.should.eql([ { rcAbbreviation: "SOUTHEPINS", name: "ABERDEEN" },
            { rcAbbreviation: "JULIAN", name: "ADVANCE" } ] );
        done();
      });
    });
    it("should fail for error status code", function(done){
      helper.nock().get("/cities?state=NC").reply(400);
      City.list(helper.createClient(), {state: "NC"}, function(err, cities){
        if(err){
          return done();
        }
        done(new Error("An error is estimated"));
      });
    });
  });
});
