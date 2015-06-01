var superagent = require("superagent");
var xml2js = require("xml2js");
var errors = require("./errors");

function transformParsedObject(obj){
  if(Array.isArray(obj)){
    return obj.map(function(i){
      return transformParsedObject(i);
    });
  }
  if(typeof obj === "object"){
    var k, result = {};
    for(k in obj){
      result[k] = transformParsedObject(obj[k]);
    }
    return result;
  }
  if(obj === "true" || obj === "false"){
    return (obj  === "true");
  }
  if(/^\d{4}\-\d{2}-\d{2}T\d{2}\:\d{2}\:\d{2}(\.\d{3})?Z$/.test(obj)){
    return new Date(obj);
  }
  if(/\d{10}/.test(obj)){
    return obj;
  }
  if(!isNaN(obj)){
    return Number(obj);
  }
  return obj;
}

function prepareToBuildXml(obj){
  if(Array.isArray(obj)){
    return obj.map(function(i){
      return prepareToBuildXml(i);
    });
  }
  if(obj instanceof Date){
    return obj.toISOString();
  }
  if(typeof obj === "object"){
    var j, k, v, result = {};
    for(k in obj)
    {
      v = obj[k];
      if(!v || k[0] === "_") continue;
      result[obj["_" + k + "XmlElement"] || k[0].toUpperCase() + k.substr(1)] = prepareToBuildXml(v);
    }
    return result;
  }
  return obj.toString();
}

function findFirstDescendant(obj, name){
  var j, k, v, r;
  for(k in obj){
    v = obj[k];
    if(k === name){
      return v;
    }
    if(Array.isArray(v)){
      for(j = 0; j < v.length; j ++){
        r = findFirstDescendant(v[j], name);
        if(r){
          return r;
        }
      }
    }
    else if(typeof v === "object"){
      r = findFirstDescendant(v, name);
      if(r){
        return r;
      }
    }
  }
  return null;
}

function findDescendants(obj, name){
  var j, k, v, r, list = [];
  for(k in obj){
    v = obj[k];
    if(k === name){
      list.push(v);
      continue;
    }
    if(Array.isArray(v)){
      for(j = 0; j < v.length; j ++){
        r = findFirstDescendant(v[j], name);
        if(r){
          list = list.concat(r);
        }
      }
    }
    else if(typeof v === "object"){
      r = findFirstDescendant(v, name);
      if(r){
        list = list.concat(r);
      }
    }
  }
  return list;
}

function createPostOrPutRequest(method, path, data){
  var request = this.prepareRequest(superagent[method](this.prepareUrl(path)));
  if(data){
    return request.send(this.buildXml(data)).type("application/xml");
  }
  return request;
}

function Client(accountId, userName, password, options){
  if(!(this instanceof Client)){
    return new Client(accountId, userName, password, options);
  }
  if(arguments.length === 1){
    options = arguments[0];
    accountId = options.accountId;
  }
  options = options || {};
  if(!accountId){
    accountId = Client.globalOptions.accountId;
  }
  if(!userName){
    userName = options.userName || Client.globalOptions.userName;
  }
  if(!password){
    password = options.password || Client.globalOptions.password;
  }
  if(!options.apiEndPoint){
    options.apiEndPoint = Client.globalOptions.apiEndPoint;
  }
  if(!options.apiVersion){
    options.apiVersion = Client.globalOptions.apiVersion;
  }
  this.prepareRequest = function(req){
    return req.auth(userName, password);
  };

  this.concatAccountPath = function(path){
    return "/accounts/" + accountId + (path?((path[0] == "/")?path:("/" + path)):"");
  }

  this.prepareUrl = function(path){
    return options.apiEndPoint + "/" + options.apiVersion + ((path[0] == "/")?path:("/" + path));
  };
}

Client.globalOptions = {
  apiEndPoint: "https://api.inetwork.com",
  apiVersion: "v1.0",
  userName: "",
  password: "",
  accountId: ""
};

Client.getIdFromHeader = function(header,callback){
  var index = location.lastIndexOf("/");
  if(index < 0){
    return callback(new Error("Missing id in response"));
  }
  var id = location.substr(index + 1);
  callback(null, id); 
};

Client.getIdFromLocationHeader = function(location, callback){
  var index = location.lastIndexOf("/");
  if(index < 0){
    return callback(new Error("Missing id in response"));
  }
  var id = location.substr(index + 1);
  callback(null, id);
};

Client.prototype.createGetRequest = function(path, query, id){
  if(id){
    path = path + "/" + id;
  }
  var request = this.prepareRequest(superagent.get(this.prepareUrl(path)));
  if(query){
    return request.query(query);
  }
  return request;
};


Client.prototype.createPostRequest = function(path, data){
  return createPostOrPutRequest.call(this, "post", path, data);
};

Client.prototype.createPutRequest = function(path, data){
  return createPostOrPutRequest.call(this, "put", path, data);
};

Client.prototype.createDeleteRequest = function(path){
  return this.prepareRequest(superagent.del(this.prepareUrl(path)));
};

Client.prototype.makeRequest = function(method){
  var callback = arguments[arguments.length - 1];
  var args = Array.prototype.slice.call(arguments, 1, arguments.length - 1);
  var request = this["create" + method[0].toUpperCase() + method.substr(1).toLowerCase() + "Request"].apply(this, args);
  var self = this;
  request.buffer().end(function(res){
    self.checkResponse(res, callback);
  });
};

Client.prototype.checkResponse = function(res, callback){
  var defaultHandler = function(parsedData){
    if(!res.ok){
      return callback(new errors.BandwidthError("", "Http code " + res.status, res.status));
    }
    callback(null, parsedData);
  };
  if(res.text.length > 0){
    this.parseXml(res.text, function(err, r){
      if(err){
        return callback(err);
      }
      var code = findFirstDescendant(r, "errorCode");
      var description = findFirstDescendant(r, "description");
      if(!code){
        var error = findFirstDescendant(r, "error");
        if(error){
          code = error.code;
          description = error.description;
        }
        else{
          var errs =  findDescendants(r, "errors");
          if(errs.length === 0){
            code = findFirstDescendant(r, "resultCode");
            description = findFirstDescendant(r, "resultMessage");
          }
          else{
            return callback(new errors.BandwidthMultipleError(errs.map(function(e){
              return new errors.BandwidthError(e.code, e.description, res.statusCode);
            })));
          }
        }
      }
      if(code && description && code !== "0"){
        return callback(new errors.BandwidthError(code, description, res.statusCode));
      }
      var keys = Object.keys(r);
      defaultHandler((keys.length == 1)?r[keys[0]]:r);
    });
  }
  else{
    defaultHandler();
  }
};

function customTags(name){
  if(name.toLowerCase() === "lata"){
    return "lata";
  }
  return name;
}

Client.prototype.parseXml = function(xml, callback){
  xml2js.parseString(xml,{
    explicitArray: false,
    tagNameProcessors: [xml2js.processors.firstCharLowerCase, customTags],
    async: true
  }, function(err, res){
    if(err){
      return callback(err);
    }
    callback(null, transformParsedObject(res));
  });
};

Client.prototype.buildXml = function(data){
  var obj = prepareToBuildXml(data);
  var builder = new xml2js.Builder();
  var xml = builder.buildObject(obj);
  return xml;
}

module.exports = Client;
