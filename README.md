# node-bandwidth-iris

[![Build](https://travis-ci.org/bandwidthcom/node-bandwidth-iris.png)](https://travis-ci.org/bandwidthcom/node-bandwidth-iris)

NodeJs Client library for IRIS / BBS API

### Install

Run

```
npm install bandwidth-iris
```

### Usage

```
var iris = require("bandwidth-iris");

//Using client directly
var client = new iris.Client("accountId", "userName", "password");
iris.Site.list(client, function(err, sites){...}); 

//Or you can use default client instance. 
//You should set up its global options before using of api functions.

//Do that only once
iris.Client.globalOptions.accountId = "accountId";
iris.Client.globalOptions.userName = "userName";
iris.Client.globalOptions.password = "password";

//Now you can call any functions without first arg 'client'

iris.Site.list(function(err, sites){
  //Default client will be used to do this call 
});

```


