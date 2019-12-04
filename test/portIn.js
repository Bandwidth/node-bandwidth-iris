var lib = require("../");
var helper = require("./helper");
var nock = require("nock");
var os = require("os");
var path = require("path");
var fs = require("fs");
var PortIn = lib.PortIn;

describe("PortIn", function(){
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
        billingTelephoneNumber: "1111",
        subscriber: {
          subscriberType: "BUSINESS",
          businessName: "Company",
          serviceAddress: {
            city: "City",
            country: "Country"
          }
        }
      };
      helper.nock().post("/accounts/FakeAccountId/portins", helper.buildXml({lnpOrder: data})).reply(200, helper.xml.portIn);
      PortIn.create(helper.createClient(), data, function(err, item){
        if(err){
          return done(err);
        }
        item.id.should.equal("d28b36f7-fa96-49eb-9556-a40fca49f7c6");
        item.status.code.should.equal(201);
        item.processingStatus.should.equal("PENDING_DOCUMENTS");
        item.billingType.should.equal("PORTIN");
        done();
      });
    });
    it("should create an order (with default client)", function(done){
      var data = {
        billingTelephoneNumber: "1111",
        subscriber: {
          subscriberType: "BUSINESS",
          businessName: "Company",
          serviceAddress: {
            city: "City",
            country: "Country"
          }
        }
      };
      helper.nock().post("/accounts/FakeAccountId/portins", helper.buildXml({lnpOrder: data})).reply(200, helper.xml.portIn);
      PortIn.create(data, function(err, item){
        if(err){
          return done(err);
        }
        item.id.should.equal("d28b36f7-fa96-49eb-9556-a40fca49f7c6");
        item.status.code.should.equal(201);
        item.processingStatus.should.equal("PENDING_DOCUMENTS");
        item.billingType.should.equal("PORTIN");
        done();
      });
    });
    it("should fail on error status code", function(done){
      var data = {
        billingTelephoneNumber: "1111",
        subscriber: {
          subscriberType: "BUSINESS",
          businessName: "Company",
          serviceAddress: {
            city: "City",
            country: "Country"
          }
        }
      };
      helper.nock().post("/accounts/FakeAccountId/portins").reply(400, "");
      PortIn.create(helper.createClient(), data,  function(err, item){
        if(err){
          return done();
        }
        done(new Error("An error is expected"));
      });
    });
  });
  describe("#update", function(){
    it("should update a site", function(done){
      var data = {
        requestedFocDate: "2014-11-18T00:00:00.000Z",
        wirelessInfo: {
          accountNumber: "77129766500001",
          pinNumber: "0000"
        }
      };
      helper.nock().put("/accounts/FakeAccountId/portins/1", helper.buildXml({lnpOrderSupp: data})).reply(200);
      var order = new PortIn();
      order.id = 1;
      order.client = helper.createClient();
      order.update(data, done);
    });
  });
  describe("#delete", function(){
    it("should delete a site", function(done){
      helper.nock().delete("/accounts/FakeAccountId/portins/1").reply(200);
      var order = new PortIn();
      order.id = 1;
      order.client = helper.createClient();
      order.delete(done);
    });
  });
  describe("#getAreaCodes", function(){
    it("should return areaCodes", function(done){
      helper.nock().get("/accounts/FakeAccountId/portins/1/areaCodes").reply(200, helper.xml.orderAreaCodes, {"Content-Type": "application/xml"});
      var order = new PortIn();
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
      helper.nock().get("/accounts/FakeAccountId/portins/1/npaNxx").reply(200, helper.xml.orderNpaNxx, {"Content-Type": "application/xml"});
      var order = new PortIn();
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
      helper.nock().get("/accounts/FakeAccountId/portins/1/totals").reply(200, helper.xml.orderTotals, {"Content-Type": "application/xml"});
      var order = new PortIn();
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
  describe("#getHistory", function(){
    it("should return totals", function(done){
      helper.nock().get("/accounts/FakeAccountId/portins/1/history").reply(200, helper.xml.orderHistory, {"Content-Type": "application/xml"});
      var order = new PortIn();
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
  describe("#getTns", function(){
    it("should return tns", function(done){
      helper.nock().get("/accounts/FakeAccountId/portins/1/tns").reply(200, helper.xml.orderTns, {"Content-Type": "application/xml"});
      var order = new PortIn();
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
  describe("#getNotes", function(){
    it("should return notes", function(done){
      helper.nock().get("/accounts/FakeAccountId/portins/1/notes").reply(200, helper.xml.notes, {"Content-Type": "application/xml"});
      var order = new PortIn();
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
      helper.nock().get("/accounts/FakeAccountId/portins/1/notes").reply(400);
      var order = new PortIn();
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
      helper.nock().post("/accounts/FakeAccountId/portins/1/notes", helper.buildXml({note: data})).reply(200, "", {"Location": "/accounts/FakeAccountId/portins/1/notes/11299"});
      helper.nock().get("/accounts/FakeAccountId/portins/1/notes").reply(200, helper.xml.notes, {"Content-Type": "application/xml"});
      var order = new PortIn();
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
      helper.nock().post("/accounts/FakeAccountId/portins/1/notes", helper.buildXml({note: data})).reply(200, "", {"Location": "/accounts/FakeAccountId/portins/1/notes/11299"});
      helper.nock().get("/accounts/FakeAccountId/portins/1/notes").reply(500);
      var order = new PortIn();
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
      helper.nock().post("/accounts/FakeAccountId/portins/1/notes", helper.buildXml({note: data})).reply(400);
      var order = new PortIn();
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
  describe("#getFiles", function(){
    it("should return list of files", function(done){
      helper.nock().get("/accounts/FakeAccountId/portins/1/loas?metadata=true").reply(200, helper.xml.files, {"Content-Type": "application/xml"});
      var order = new PortIn();
      order.id = 1;
      order.client = helper.createClient();
      order.getFiles(true, function(err, items){
        if(err){
          return done(err);
        }
        items.length.should.equal(6);
        items[0].fileName.should.equal("d28b36f7-fa96-49eb-9556-a40fca49f7c6-1416231534986.txt");
        items[0].fileMetaData.documentType.should.equal("LOA");
        done();
      });
    });
    it("should return list of files (without metadata)", function(done){
      helper.nock().get("/accounts/FakeAccountId/portins/1/loas?metadata=false").reply(200, helper.xml.files, {"Content-Type": "application/xml"});
      var order = new PortIn();
      order.id = 1;
      order.client = helper.createClient();
      order.getFiles(function(err, items){
        if(err){
          return done(err);
        }
        items.length.should.equal(6);
        items[0].fileName.should.equal("d28b36f7-fa96-49eb-9556-a40fca49f7c6-1416231534986.txt");
        done();
      });
    });
    it("should fail for error status code", function(done){
      helper.nock().get("/accounts/FakeAccountId/portins/1/loas?metadata=false").reply(400);
      var order = new PortIn();
      order.id = 1;
      order.client = helper.createClient();
      order.getFiles(function(err, items){
        if(err){
          return done();
        }
        done(new Error("An error is estimated"));
      });
    });
  });
  describe("#getFileMetadata", function(){
    it("should return file's metadata", function(done){
      helper.nock().get("/accounts/FakeAccountId/portins/1/loas/file.txt/metadata").reply(200, helper.xml.fileMetadata, {"Content-Type": "application/xml"});
      var order = new PortIn();
      order.id = 1;
      order.client = helper.createClient();
      order.getFileMetadata("file.txt", function(err, meta){
        if(err){
          return done(err);
        }
        meta.documentType.should.equal("LOA");
        done();
      });
    });
  });
  describe("#updateFileMetadata", function(){
    it("should update file's metadata", function(done){
      var metadata = { documentName: "doc", documentType: "type"};
      helper.nock().put("/accounts/FakeAccountId/portins/1/loas/file.txt/metadata", helper.buildXml({ fileMetaData: metadata})).reply(200);
      var order = new PortIn();
      order.id = 1;
      order.client = helper.createClient();
      order.updateFileMetadata("file.txt", metadata, done);
    });
  });
  describe("#getFile", function(){
    var tmpFile = path.join(os.tmpdir(), "dest.txt");
    beforeEach(function(){
      helper.nock().get("/accounts/FakeAccountId/portins/1/loas/file.txt").reply(200, "12345", {"Content-Type": "text/plain"});
    });
    afterEach(function(done){
      nock.cleanAll();
      fs.unlink(tmpFile, done);
    });
    it("should download file to destination file", function(done){
      var order = new PortIn();
      order.id = 1;
      order.client = helper.createClient();
      var stream = order.getFile("file.txt", tmpFile);
      stream.on("finish", function(){
        fs.readFile(tmpFile, "utf8", function(err, text){
          if(err){
            done(err);
          }
          text.should.equal("12345");
          done();
        });
      });
    });
    it("should download file to destination stream", function(done){
      var order = new PortIn();
      order.id = 1;
      order.client = helper.createClient();
      var stream = order.getFile("file.txt", fs.createWriteStream(tmpFile));
      stream.on("finish", function(){
        fs.readFile(tmpFile, "utf8", function(err, text){
          if(err){
            done(err);
          }
          text.should.equal("12345");
          done();
        });
      });
    });
    it("should allow control download process", function(done){
      var order = new PortIn();
      order.id = 1;
      order.client = helper.createClient();
      var stream = order.getFile("file.txt").pipe(fs.createWriteStream(tmpFile));
      stream.on("finish", function(){
        fs.readFile(tmpFile, "utf8", function(err, text){
          if(err){
            done(err);
          }
          text.should.equal("12345");
          done();
        });
      });
    });
  });
  describe("#createFile", function(){
    var order, tmpFile = path.join(os.tmpdir(), "dest.txt");
    beforeEach(function(done){
      helper.nock().post("/accounts/FakeAccountId/portins/1/loas", "12345", {"Content-Type": "text/plain"}).reply(200, helper.xml.fileCreated, {"Content-Type": "application/xml"});
      order = new PortIn();
      order.id = 1;
      order.client = helper.createClient();
      fs.writeFile(tmpFile, "12345", "utf8", done);
    });
    afterEach(function(done){
      nock.cleanAll();
      fs.unlink(tmpFile, done);
    });
    it("should upload file to the server (via buffer)", function(done){
      order.createFile(new Buffer.from("12345", "utf8"), "text/plain", function(err, fileName){
        if(err){
          return done(err);
        }
        fileName.should.equal("test.txt");
        done();
      });
    });
    it("should upload file to the server (via file path)", function(done){
      order.createFile(tmpFile, "text/plain", function(err, fileName){
        if(err){
          return done(err);
        }
        fileName.should.equal("test.txt");
        done();
      });
    });
    it("should upload file to the server (via stream)", function(done){
      order.createFile(fs.createReadStream(tmpFile), "text/plain", function(err, fileName){
        if(err){
          return done(err);
        }
        fileName.should.equal("test.txt");
        done();
      });
    });
    it("should fail on error status code", function(done){
      nock.cleanAll();
      helper.nock().post("/accounts/FakeAccountId/portins/1/loas", "11111", {"Content-Type": "text/plain"}).reply(400);
      order.createFile(new Buffer.from("11111", "utf8"), "text/plain", function(err, fileName){
        if(err){
          return done();
        }
        done(new Error("An error was expected"));
      });
    });
    it("should upload file to the server (default media type)", function(done){
      nock.cleanAll();
      helper.nock().post("/accounts/FakeAccountId/portins/1/loas", "12345", {"Content-Type": "application/octet-stream"}).reply(200, helper.xml.fileCreated, {"Content-Type": "application/xml"});
      order.createFile(new Buffer.from("12345", "utf8"), function(err, fileName){
        if(err){
          return done(err);
        }
        fileName.should.equal("test.txt");
        done();
      });
    });
  });
  describe("#updateFile", function(){
    var order, tmpFile = path.join(os.tmpdir(), "dest.txt");
    beforeEach(function(done){
      helper.nock().put("/accounts/FakeAccountId/portins/1/loas/test.txt", "12345", {"Content-Type": "text/plain"}).reply(200);
      order = new PortIn();
      order.id = 1;
      order.client = helper.createClient();
      fs.writeFile(tmpFile, "12345", "utf8", done);
    });
    afterEach(function(done){
      nock.cleanAll();
      fs.unlink(tmpFile, done);
    });
    it("should upload file to the server (via buffer)", function(done){
      order.updateFile("test.txt", new Buffer.from("12345", "utf8"), "text/plain", done);
    });
    it("should upload file to the server (via file path)", function(done){
      order.updateFile("test.txt", tmpFile, "text/plain", done);
    });
    it("should upload file to the server (via stream)", function(done){
      order.updateFile("test.txt", fs.createReadStream(tmpFile), "text/plain", done);
    });
    it("should fail on error status code", function(done){
      nock.cleanAll();
      helper.nock().put("/accounts/FakeAccountId/portins/1/loas/test.txt", "11111", {"Content-Type": "text/plain"}).reply(400);
      order.updateFile("test.txt", new Buffer.from("11111", "utf8"), "text/plain", function(err){
        if(err){
          return done();
        }
        done(new Error("An error was expected"));
      });
    });
    it("should upload file to the server (default media type)", function(done){
      nock.cleanAll();
      helper.nock().put("/accounts/FakeAccountId/portins/1/loas/test.txt", "12345", {"Content-Type": "application/octet-stream"}).reply(200, helper.xml.fileCreated, {"Content-Type": "application/xml"});
      order.updateFile("test.txt", new Buffer.from("12345", "utf8"), done);
    });
  });
});
