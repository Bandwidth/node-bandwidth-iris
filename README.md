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



### Sites

#### Create A Site
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

#### Updating a Site
```Javascript
site.name = "Some new name";
site.update(callback);
```

#### Deleting a Site
```Javascript
site.delete(callback);
```

#### Listing All Sites
```Javascript
iris.Site.list(function(err,list){
  for(var site in list){
    console.log("ID: " + site.id + " Name: " + site.name);
  }
});

```


### Available Numbers
```Javascript
iris.AvailableNumbers.list({options}, callback);

Example:
iris.AvailableNumbers.list({areaCode:"818", quantity:5, enableTNDetail:true}, function(err,res){
  console.log(res.telephoneNumberDetailList.telephoneNumberDetail[0].fullNumber);  
});

```

