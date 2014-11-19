var superagent = require("superagent");
var xml2js = require("xml2js");
var errors = require("./errors");

function transformParsedObject(obj){
  if(Array.isArray(obj)){
    return obj.map(function(i){
      return transformParsedObject(i);
    });
    for(j = 0; j < obj.length; j ++){
      transformParsedObject(obj[j]);
    }
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
  if(/(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))/.test(obj)){
    return new Date(obj);
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
  if(obj instanceof Date){
    return obj.toISOString();
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
      r = findFirstDescendant(v);
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
      r = findFirstDescendant(v);
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

function Client(accountId, userName, password, apiEndPoint, apiVersion){
  if(!(this instanceof Client)){
    return new Client(accountId, userName, password, apiEndPoint, apiVersion);
  }
  if(!accountId){
    accountId = process.env.BANDWIDTH_API_ACCOUNT_ID;
  }
  if(!userName){
    userName = process.env.BANDWIDTH_API_USERNAME;
  }
  if(!password){
    password = process.env.BANDWIDTH_API_PASSWORD;
  }
  if(!apiEndPoint){
    apiEndPoint = process.env.BANDWIDTH_API_ENDPOINT || "https://api.inetwork.com";
  }
  if(!apiVersion){
    apiVersion = process.env.BANDWIDTH_API_VERSION || "v1.0";
  }
  this.prepareRequest = function(req){
    return req.auth(userName, password);
  };

  this.concatAccountPath = function(path){
    return "/accounts/" + accountId + ((path[0] == "/")?path:("/" + path));
  }

  this.prepareUrl = function(path){
    return apiEndPoint + "/" + apiVersion + ((path[0] == "/")?path:("/" + path));
  };
}

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
  if((res.text || "").length > 0){
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
          var errors =  findDescendants(r, "errors");
          if(errors.length === 0){
            code = findFirstDescendant(r, "resultCode");
            description = findFirstDescendant(r, "resultMessage");
          }
          else{
            return callback(new errors.BandwidthMultipleError(errors.map(function(e){
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

Client.prototype.parseXml = function(xml, callback){
  xml2js.parseString(xml,{
    explicitArray: false,
    tagNameProcessors: [xml2js.processors.firstCharLowerCase],
    async: true
  }, function(err, res){
    if(err){
      return callback(err);
    }
    transformParsedObject(res);
    callback(null, res);
  });
};

Client.prototype.buildXml = function(data){
  var obj = prepareToBuildXml(data);
  var builder = new xml2js.Builder();
  var xml = builder.buildObject(obj);
  return xml;
}

module.exports = Client;
