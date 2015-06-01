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