# node-bandwidth-iris

[![Build](https://travis-ci.org/bandwidthcom/node-bandwidth-iris.png)](https://travis-ci.org/bandwidthcom/node-bandwidth-iris)

NodeJs Client library for IRIS / BBS API

## Install

Run

```
npm install bandwidth-iris
```

## Usage

```
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
iris.AvailableNumbers.list({options}, callback);

Example:
iris.AvailableNumbers.list({areaCode:"818", quantity:5, enableTNDetail:true}, function(err,res){
  console.log(res.telephoneNumberDetailList.telephoneNumberDetail[0].fullNumber);  
});

```

## Available NpaNxx
```Javascript
iris.AvailableNpaNxx.list({areaCode:"818", quantity:5}, function(err, res){
  if(err){
    console.log(err);
  } else {
    console.log("Available NpaNxx: " + JSON.stringify(res,null, 2));
  }
});
```

## Cities
```Javascript
iris.City.list({"available":true, "state":"CA"}, function(err,list){
  console.log("Cities for selected state: " + JSON.stringify(list, null, 2));
});
```

## Covered Rate Centers
```Javascript
var zip = process.argv[2];
iris.CoveredRateCenter.list({"zip":"27601"}, function(err,list){
  console.log("Covered Rate Centers: " + JSON.stringify(list, null, 2));
});
```

## Disconnected Numbers
Retrieves a list of disconnected numbers for an account
```Javascript
iris.DiscNumber.list({"areaCode":"919"}, function(err,list){
  console.log("Disconnected numbers: " + JSON.stringify(list, null, 2));
})
```

## Disconnect Numbers 
The Disconnect object is used to disconnect numbers from an account.  Creates a disconnect order that can be tracked

### Create Disconnect
```Javascript
iris.Disconnect.create("Disconnect Order Name", ["9195551212", "9195551213"], function(err, item){
  console.log("Disconnect order id: " + item.id);  
});
```

### Get Disconnect
```Javascript
iris.Disconnect.get("orderId", {tnDetail:true}, function(err,order){
  console.log("Disconnect order: " + JSON.stringify(order,null,2));
})
```

### Add Note to Disconnect
```Javascript
var note = {userId: "my id", description: "Test"};
iris.Disconnect.get("orderId", {tnDetail:true}, function(err,order){
  order.addNote(note, function(err, note){
    console.log("Note added: " + note.id);
  });
});
```

### Get Notes for Disconnect
```Javascript
iris.Disconnect.get("orderId", {tnDetail:true}, function(err,order){
  order.getNotes(function(err, notes){
    console.log(JSON.stringify(notes, null, 2));
  });
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

iris.Dlda.create(dlda, function(err, item){
  console.log("Created order: " + item.id);
});
```

### Get Dlda
```Javascript
iris.Dlda.get("dldaId", function(err, item){
  console.log(JSON.stringify(item));
});
```

### Get Dlda History
```Javascript
iris.Dlda.get("dldaId", function(err,dlda){
  dlda.getHistory(function(err,history){
    console.log("History: " + JSON.stringify(history));
  });
});
```

### List Dldas
```Javascript
iris.Dlda.list({telephoneNumber:"9195551212"}, function(err,list){
  console.log(JSON.stringify(list));
});
```

## Import To Account
This path is generally not available to Bandwidth accounts, and as such is not documented in this API

## In Service Numbers

### List InService Numbers
```Javascript
iris.InServiceNumber.list({"areaCode":"919"}, function(err, list){
  console.log("Numbers List: " + JSON.stringify(list,null,2));
  
});
```

### Get InService Number Detail
```Javascript
iris.InServiceNumber.get("9195551212", function(err,item){
  console.log("In Service Number: " + JSON.stringify(item, null, 2));  
});
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
iris.Lidbs.create(data, function(err,lidb){
  console.log(JSON.stringify(lidb, null, 2));
});
```
### Get Lidb
```Javascript
iris.Lidbs.get("id", function(err,lidb){
  console.log(JSON.stringify(lidb, null, 2));
});
```
### List Lidbs
```Javascript
iris.Lidbs.list({telephoneNumber:"9195551212"}, function(err,list){
  console.log(JSON.stringify(list, null, 2));
});
```

## LNP Checker
### Check LNP
```Javascript
var numbers = ["9195551212", "9195551213"];
var fullCheck = true;
iris.LnpChecker.check(numbers, fullCheck, function(err,res){
  console.log(JSON.stringify(res, null, 2))
});
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

iris.LsrOrder.create(data, function(err, order){
  console.log(JSON.stringify(order, null, 2));  
});
```
### Get LSR Order
```Javascript
iris.LsrOrder.get("id", function(err, order){
  console.log(JSON.stringify(order)) 
});
```
### List LSR Orders
```Javascript
iris.LsrOrder.list({pon:"Some Pon"}, function(err,list){
  console.log(JSON.stringify(list, null, 2));
});
```
### Update LSR Order
```Javascript
iris.LsrOrder.get("id", function(err, order){
  order.requestedFocDate = "2015-11-16";
  iris.LsrOrder.update(order, function(err,res){
    if(err){
      console.log(err)
    }else {
      console.log("update succeeded!");
    }
  });
})
```
### Get LSR Order History
```Javascript
iris.LsrOrder.get("id", function(err, order){
  order.getHistory(function(err,history){
    console.log(JSON.stringify(history, null, 2));
  });
});
```
### Get LSR Order Notes
```Javascript
iris.LsrOrder.get("id", function(err,order){
  order.getNotes(function(err, notes){
    console.log(JSON.stringify(notes, null, 2));
  });
});
```
### Add LSR Order Note
```Javascript
var note = {userId: "my id", description: "Test"};
iris.LsrOrder.get("id", function(err, order){
  order.addNote(note, function(err, res){
    console.log("Note added: " + note.id);
  });
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

iris.Order.create(order, function(err,res){
  if(err){
    console.log("error: " + err);
  }else {
    console.log("Order successfully created" );
    console.log(JSON.stringify(res.order,null,2));
  }
});
```
### Get Order
```Javascript
var orderId = "the order id";

iris.Order.get(orderId, function(err,order){
  if(err){
    console.log("error: " + err);
  }else {
    console.log("Order Details:" );
    console.log(JSON.stringify(order,null,2));
  }
});
```
### List Orders
```Javascript
var query = {customerOrderId:"someId"};
iris.Order.list(query, function(err,list){
  //Note that we do not return a client with orders in the list due to additional details in the respons
  console.log(JSON.stringify(list, null, 2));
});
```
### List Area Codes for Order
```Javascript
iris.Order.get("orderId", function(err, order){
  order.getAreaCodes(function(err, areaCodes){
    console.log(JSON.stringify(areaCodes, null, 2));
  });
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

iris.PortIn.create(data, function(err, item){
  console.log(JSON.stringify(item, null, 2));
});
```
## Get PortIn
```Javascript
iris.PortIn.get("id", function(err, portIn){
  console.log(JSON.stringify(portIn, null, 2));
});
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

iris.Site.create(site, function(err,site){
  console.log("site created with id: " + site.id);
});
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
iris.Site.list(function(err,list){
  for(var site in list){
    console.log("ID: " + site.id + " Name: " + site.name);
  }
});

```
