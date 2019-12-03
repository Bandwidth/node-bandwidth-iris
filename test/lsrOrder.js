var lib = require("../");
var helper = require("./helper");
var nock = require("nock");
var LsrOrder = lib.LsrOrder;

describe("LsrOrder", function(){
  before(function(){
    nock.disableNetConnect();
    helper.setupGlobalOptions();
  });
  after(function(){
    nock.cleanAll();
    nock.enableNetConnect();
  });
  describe("#list", function(){
    it("should return a list of LsrOrders ", function(done){
      helper.nock().get("/accounts/FakeAccountId/lsrorders").reply(200, helper.xml.lsrOrders, {"Content-Type":"application/xml"});
      LsrOrder.list(helper.createClient(), {}, function(err,list){
        if(err){
          return done(err);
        }
        list.should.be.ok;
        done();
      });
    });
  });
  describe("#get", function(){
    it("should get LsrOrder successfully", function(done){
      helper.nock().get("/accounts/FakeAccountId/lsrorders/1").reply(200, helper.xml.lsrOrder, {"Content-Type": "application/xml"});
      LsrOrder.get(helper.createClient(), "1", function(err, lsrOrder){
        if(err){
          return done(err);
        }
        lsrOrder.should.be.ok;
        lsrOrder.accountId.should.eql(9999999);
        lsrOrder.authorizingPerson.should.eql("Jim Hopkins");
        done();
      });
    });
  });
  describe("#create", function(){
    it("should create lsrOrder successfully", function(done){
      var data = {
        pon:"Some Pon",
        customerOrderId: "MyId5",
        sPID:"123C",
        billingTelephoneNumber:"9192381468",
        requestedFocDate: "2015-11-15",
        authorizingPerson: "Jim Hopkins",
        subscriber:{
          subscriberType:"BUSINESS",
          businessName:"BusinessName",
          serviceAddress: {
            houseNumber:"11",
            streetName: "Park",
            streetSuffix: "Ave",
            city:"New York",
            stateCode: "NY",
            zip: "90025"
          },
          accountNumber:"123463",
          pinNumber:"1231"
        },
        listOfTelephoneNumbers: {
          telephoneNumber:["9192381848", "9192381467"]
        }
      }
      helper.nock().post("/accounts/FakeAccountId/lsrorders", helper.buildXml({lsrOrder: data})).reply(201, "", {"Location": "/accounts/FakeAccountId/lsrorders/1"});
      helper.nock().get("/accounts/FakeAccountId/lsrorders/1").reply(200, helper.xml.lsrOrder, {"Content-Type": "application/xml"});
      LsrOrder.create(helper.createClient(), data, function(err,lsrOrder){
        if(err){
          return done(err);
        }
        lsrOrder.should.be.ok;
        lsrOrder.accountId.should.eql(9999999);
        done();
      });
    });
  });
  describe("#update", function(){
    it("should update successfully", function(done){
      var data = {requestedFocDate:"2015-11-16"};
      helper.nock().put("/accounts/FakeAccountId/lsrorders/1", helper.buildXml({lsrOrder: data})).reply(200);
      var order = new LsrOrder();
      order.id = "1";
      order.client = helper.createClient();
      order.requestedFocDate = "2015-11-16";
      order.update(data,done);
    })
  });
});
