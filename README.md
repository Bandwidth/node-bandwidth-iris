# node-bandwidth-iris

[![Build](https://travis-ci.org/bandwidth/node-bandwidth-iris.png)](https://travis-ci.org/bandwidth/node-bandwidth-iris)

NodeJs Client library for IRIS / BBS API

## Supported Versions
This SDK stable for node versions 7 and above

| Version                        | Support Level            |
|:-------------------------------|:-------------------------|
| <7                        | Unsupported              |
| 7.*                            | Supported              |
| 8.*                            | Supported                |
| 9.*                            | Supported              |
| 10.4.1                            | Supported              |

## Release Notes
| Version | Notes |
|:--|:--|
| 1.0.1 | Fixed issue with https://dashboard.bandwidth.com/api/tns not properly redirecting when not given query params |

## Install

Run

```
npm install bandwidth-iris
```

## Usage

```js
var iris = require("bandwidth-iris");

//Using client directly
var client = new iris.Client("accountId", "userName", "password");
iris.Site.list(client, function(err, sites){...}); 

//Or you can use default client instance (do this only once)
iris.Client.globalOptions.accountId = "accountId";
iris.Client.globalOptions.userName = "userName";
iris.Client.globalOptions.password = "password";

//Now you can call any functions without first arg 'client'

iris.Site.list(function(err, sites){
  //Default client will be used to do this call
});

```

## Examples
There is an 'examples' folder in the source tree that shows how each of the API objects work with simple example code.  To run the examples:

```bash
$ cd examples
$ cp config.js.example config.js
```
Edit the config.js to match your IRIS credentials and run the examples individually.  e.g.

```bash
node coveredRateCenters-sample.js
```
If the examples take command line parameters, you will get the usage by just executing the individual script.


## API Objects
### General principles
When fetching objects from the API, it will always return an object that has the client
instantiated so that you can call dependent methods as well as update, delete.

Example:

```Javascript
iris.Site.create({siteObject}, function(err,item){
  console.log("the site ID is: " + item.id);
  item.delete(function(err,res){ //no need to pass the client again
  });
});
```

Each entity has a get, list, create, update and delete method if appropriate.

All properties are camel-cased for Javascript readability, and are converted on the fly to the proper 
case by the internals of the API when converted to XML.



## Available Numbers

```Javascript
iris.AvailableNumbers.list(query, callback);
```

## Available NpaNxx

```Javascript
iris.AvailableNpaNxx.list({areaCode:"818", quantity:5}, callback);
```

## Cities

```Javascript
iris.City.list({"available":true, "state":"CA"}, callback);
```

## Covered Rate Centers

```Javascript
iris.CoveredRateCenter.list({"zip":"27601"}, callback);
```

## Disconnected Numbers
Retrieves a list of disconnected numbers for an account

```Javascript
iris.DiscNumber.list({"areaCode":"919"}, callback);
```

## Disconnect Numbers 
The Disconnect object is used to disconnect numbers from an account.  Creates a disconnect order that can be tracked

### Create Disconnect

```Javascript
iris.Disconnect.create("Disconnect Order Name", ["9195551212", "9195551213"], callback);
```

### Get Disconnect

```Javascript
iris.Disconnect.get("orderId", {tnDetail:true}, callback);
```

### Add Note to Disconnect

```Javascript
var note = {userId: "my id", description: "Test"};
iris.Disconnect.get("orderId", {tnDetail:true}, function(err,order){
  order.addNote(note, callback);
});
```

### Get Notes for Disconnect

```Javascript
iris.Disconnect.get("orderId", {tnDetail:true}, function(err,order){
  order.getNotes(callback);
});
```

## Dlda

### Create Ddla

```Javascript
var dlda = {
  customerOrderId:"Your Order Id",
  dldaTnGroups: [
    dldaTnGroup: {
      telephoneNumbers: ["9195551212"],
      subscriberType: "RESIDENTIAL",
      listingType: "LISTED",
      listingName:{
        firstName:"John",
        lastName:"Smith"
      },
      listAddress:true,
      address:{
        houseNumber: "123",
        streetName: "Elm",
        streetSuffix: "Ave",
        city: "Carpinteria",
        stateCode:"CA",
        zip:"93013",
        addressType: "DLDA"
      }
    }
  ]
}

iris.Dlda.create(dlda, callback);
```

### Get Dlda

```Javascript
iris.Dlda.get(id, callback);
```

### Get Dlda History

```Javascript
iris.Dlda.get(id, function(err,dlda){
  dlda.getHistory(callback);
});
```

### List Dldas

```Javascript
iris.Dlda.list({telephoneNumber:"9195551212"}, callback);
```

## Import To Account
This path is generally not available to Bandwidth accounts, and as such is not documented in this API

## In Service Numbers

### List InService Numbers

```Javascript
iris.InServiceNumber.list({"areaCode":"919"}, callback);
```

### Get InService Number Detail

```Javascript
iris.InServiceNumber.get("9195551212", callback);
```

## Lidb

### Create

```Javascript
var data = {
  customerOrderId:"A test order",
  lidbTnGroups:{
    lidbTnGroup:{
      telephoneNumbers:["8048030097", "8045030098"],
      subscriberInformation:"Joes Grarage",
      useType: "RESIDENTIAL",
      visibility: "PUBLIC"
    }
  }
}
iris.Lidbs.create(data, callback);
```
### Get Lidb

```Javascript
iris.Lidbs.get(id, callback);
```
### List Lidbs

```Javascript
iris.Lidbs.list({telephoneNumber:"9195551212"}, callback);
```

## LNP Checker
### Check LNP

```Javascript
var numbers = ["9195551212", "9195551213"];
var fullCheck = true;
iris.LnpChecker.check(numbers, fullCheck, callback);
```

## LSR Orders
### Create LSR Order

```Javascript
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
};

iris.LsrOrder.create(data, callback);
```

### Get LSR Order

```Javascript
iris.LsrOrder.get(id, callback);
```

### List LSR Orders

```Javascript
iris.LsrOrder.list({pon:"Some Pon"}, callback);
```

### Update LSR Order

```Javascript
iris.LsrOrder.get("id", function(err, order){
  order.requestedFocDate = "2015-11-16";
  iris.LsrOrder.update(order, callback);
})
```
### Get LSR Order History

```Javascript
iris.LsrOrder.get("id", function(err, order){
  order.getHistory(callback);
});
```

### Get LSR Order Notes

```Javascript
iris.LsrOrder.get("id", function(err,order){
  order.getNotes(callback);
});
```

### Add LSR Order Note

```Javascript
var note = {userId: "my id", description: "Test"};
iris.LsrOrder.get("id", function(err, order){
  order.addNote(note, callback);
});
```

## Orders
### Create Order

```Javascript
var order = {
  name:"A Test Order",
  siteId: 1111,
  existingTelephoneNumberOrderType: {
    telephoneNumberList:[
      {
        telephoneNumber:"9195551212"
      }
    ]
  }
};

iris.Order.create(order, callback);
```

### Get Order

```Javascript
iris.Order.get(id, callback);
```

### List Orders

```Javascript
iris.Order.list(query, callback);
```

### List Area Codes for Order

```Javascript
iris.Order.get(id, function(err, order){
  order.getAreaCodes(callback);
});

```

### Order Instance Methods 

```Javascript
// get Area Codes
order.getAreaCodes(callback);

// add note to order
var note = {userId: "my id", description: "Test"};
order.addNote(note,callback);

//get Npa Nxxs
order.getNpaNxx(callback);

// get number totals
order.getTotals(callback);

// get all Tns for an order
order.getTns(callback)

// get order history
order.getHistory(callback);

// get order notes
order.getNotes(callback);
```

## Port Ins
### Create PortIn
```Javascript
var data = {
  siteId:1234,
  peerId:5678,
  billingTelephoneNumber: "9195551212",
  subscriber: {
    subscriberType: "BUSINESS",
    businessName: "Company",
    serviceAddress: {
      houseNumber: "123",
      streetName: "EZ Street",
      city: "Raleigh",
      stateCode: "NC",
      county: "Wake"
    }
  }, 
  loaAuthorizingPerson: "Joe Blow",
  listOfPhoneNumbers: {
    phoneNumber:["9195551212"]
  },
  billingType: "PORTIN"
};

iris.PortIn.create(data, callback);
```

## Get PortIn

```Javascript
iris.PortIn.get("id", callback)
```

## List PortIns

``` Javascript
var query = {pon:"a pon"};
iris.PortIn.list(query, function(err, list){
  console.log(JSON.stringify(list));
});
```

### PortIn Instance methods

```Javascript
// fetch instance using PortIn.get(callback, portIn)
portIn.update(data, callback);
portIn.delete(callback);
portIn.getAreaCodes(callback);
portIn.getNpaNxx(callback);
portIn.getTotals(callback);
portIn.getTns(callback);
portIn.getNotes(callback);
portIn.addNote(callback);
portIn.getActivationStatus(callback);
```

### PortIn File Management

```Javascript

iris.PortIn.get("id", function(err, portIn){
  // Add File
  portIn.createFile(fs.createReadStream("myFile.txt"), callback);

  // Update File
  portIn.updateFile("myFile.txt", fs.createReadStream("myFile.txt"), callback);

  // Get File
  portIn.getFile("myFile.txt", callback);

  // Get File Metadata
  portIn.getFileMetadata("myFile.txt", callback);

  // Get Files
  portIn.getFiles(callback);
});
```

## Port Out
### List PortOuts

```Javascript
var query = {"status":"complete"}
iris.PortOut.list(query, callback);
```

### Get PortOut

```Javascript
iris.PortOut.get(id, callback);
```

## Rate Centers
### List Ratecenters

```Javascript
var query = {"available":true, "state":"CA"}
iris.RateCenter.list(query, callback);
```

## SIP Peers
### Create SIP Peer

```Javascript
var data = {
  peerName:"A New SIP Peer",
  isDefaultPeer:false, 
  shortMessagingProtocol:"SMPP",
  siteId:selectedSite, 
  voiceHosts:[
    {
      host:{
        hostName:"1.1.1.1"
      }
    }
  ],
  smsHosts:[
    {
      host:{
        hostName:"1.1.1.1"
      }
    }
  ],
  terminationHosts:[
    {
      terminationHost:{
        hostName:"1.1.1.1",
        port:5060,
      }
    }
  ]
};

iris.SipPeer.create(data, callback);
```

### Get SIP Peer

```Javascript
iris.SipPeer.get("id", callback);
```

### List SIP Peers

```Javascript
iris.SipPeer.list(siteId, callback);
```

### Delete SIP Peer

```Javascript
iris.SipPeer.get(function(err, sipPeer){
  sipPeer.delete(callback);
});
```

### SipPeer TN Methods

```Javascript
iris.SipPeer.get(function(err,sipPeer){
  // get TN for this peer
  sipPeer.getTns(number, callback);  
  
  // get all TNs for this peer
  sipPeer.getTns(callback);

  // Update TNs for this peer
  var tns = {fullNumber: "123456", rewriteUser: "test"};
  sipPeer.updateTns(number, tns, callback);

  // Move Tns to new peer
  var numbersToMove = ["9195551212", "9195551213"];
  sipPeer.moveTns(numbersToMove, callback);
});
```

## Sites

### Create A Site
A site is what is called Location in the web UI. 

```Javascript
var site = {
  name:"A new site",
  description:"A new description",
  address:{
    houseNumber: "123",
    streetName: "Anywhere St",
    city: "Raleigh",
    stateCode:"NC",
    zip: "27609",
    addressType: "Service"
  }
};
iris.Site.create(site, callback);
```

### Updating a Site

```Javascript
site.name = "Some new name";
site.update(site, callback);
```

### Deleting a Site

```Javascript
site.delete(callback);
```
### Listing All Sites
```Javascript
iris.Site.list(callback);
```

### Site Instance Methods

```Javascript
iris.Site.get(id, function(err,site){
  // getInService numbers
  site.getInserviceNumbers(query, callback);

  // get Orders
  site.getOrders(query, callback);

  // get PortIns
  site.getPortIns(query, callback);

  // get Total Tns
  site.getTotalTns(query, callback); 
});
```
### Site SipPeer Methods

```Javascript
iris.Site.get(id, function(err,site){
  // get Sip Peers
  site.getSipPeers(callback);

  // get Sip Peer
  site.getSipPeer(id, callback);

  // create Sip Peer
  var sipPeer = {name:"SIP Peer"};
  site.createSipPeer(sipPeer, callback);
});
```

## Subscriptions
### Create Subscription

```Javascript
var subscription = {
  orderType:"orders",
  callbackSubcription: {
    url:"http://mycallbackurl.com",
    user:"userid",
    expiry: 12000
  }
};
iris.Subscription.create(subscription, callback);
```

### Get Subscription

```Javascript
iris.Subscription.get(id, callback);
```

### List Subscriptions

```Javascript
iris.Subscription.list(query, callback);
```

### Subscription Instance Methods

```Javascript
iris.Subscription.get(id, function(err, subscription){
  // update subscription
  var updatedData = {orderType:"portins"};
  subscription.update(updatedData, callback)

  // delete subscription
  subscription.delete(callback);
});
```

## TNs
### Get TN

```Javascript
iris.Tn.get(fullNumber, callback);
```

### List TNs

```Javascript
iris.Tn.list(query, callback);
```

### TN Instance Methods

```Javascript
iris.Tn.get(fullNumber, function(err, tn){
  // Get TN Details
  tn.getTnDetails(callback);

  // Get Sites
  tn.getSites(callback);

  // Get Sip Peers
  tn.getSipPeers(callback);

  // Get Rate Center
  tn.getRateCenter(callback)
});
```

## TN Reservation
### Create TN Reservation

```Javascript
iris.TnReservation.create({"reservedTn":"9195551212"}, callback);
```

### Get TN Reservation

```Javascript
iris.TnReservation.get(id, callback);
```

### Delete TN Reservation

```Javascript
iris.TnReservation.get(id, function(err, tn){
  tn.delete(callback);
});
```
