const _ = _rqr('lodash');
var request = _rqr('request');


//Support for Built.io
function _rqr(lib){ return typeof $require != 'undefined' ? $require(lib) : require(lib); }
function _exp(constr){ if(typeof $export != 'undefined'){ $export(null, constr); } else { module.exports=constr; } }


/**
  A promise-based NodeJS connector for accessing the Hubspot API.
  Provides HAPIKEY-based access to the Hubspot API.

  @version 1.0.0
*/
function Hubspot(hapikey){
  this.baseReq = request.defaults({
    baseUrl: 'https://api.hubapi.com',
    qs:{ hapikey: hapikey},
    json: true
  })
}


/**
  Gets the most recently modified companies from Hubspot.
  @param {integer} offset This is used to get the next page of results.
  Each request will return an offset in the response. Use that offset in the
  URL of your next request to get the next page of results.
  @param {integer} count objects to return
  @param {boolean} flatten optional parameter indicating whether to flatten the
  property output and just return simple objects containing the current values
  (defaults to true).
*/
Hubspot.prototype.getRecentlyModifiedCompanies = function(offset, count, flatten){
  var self = this;
  return new Promise(function(resolve, reject){
    var qs = {};
    if(!_.isNil(offset)){ qs.offset = offset };
    if(!_.isNil(count)){ qs.count = count };
    self.baseReq({method: 'GET', url: '/companies/v2/companies/recent/modified', qs: qs },
    function(err, resp, body){
      if(err){
        reject(err);
      } else {
        if(resp.statusCode == 200){
          if(_.isNil(flatten) || flatten){
            resolve({
              hasMore: body.hasMore,
              offset: body.offset,
              total: body.total,
              results: _flattenResults(body.results)
            });
          } else {
            resolve(body);
          }

        } else {
          reject(new Error('Hubspot Error (HTTP '+resp.statusCode+'). Details:\n'+body ))
        }
      }
    })
  })
};


/**
  Gets the most recently created companies from Hubspot.
  @param {integer} offset This is used to get the next page of results.
  Each request will return an offset in the response. Use that offset in the
  URL of your next request to get the next page of results.
  @param {integer} count objects to return
  @param {boolean} flatten optional parameter indicating whether to flatten the
  property output and just return simple objects containing the current values
  (defaults to true).
*/
Hubspot.prototype.getRecentlyCreatedCompanies = function(offset, count, flatten){
  var self = this;
  return new Promise(function(resolve, reject){
    var qs = {};
    if(!_.isNil(offset)){ qs.offset = offset };
    if(!_.isNil(count)){ qs.count = count };
    self.baseReq({method: 'GET', url: '/companies/v2/companies/recent/created', qs: qs },
    function(err, resp, body){
      if(err){
        reject(err);
      } else {
        if(resp.statusCode == 200){
          if(_.isNil(flatten) || flatten){
            resolve({
              hasMore: body.hasMore,
              offset: body.offset,
              total: body.total,
              results: _flattenResults(body.results)
            });
          } else {
            resolve(body);
          }

        } else {
          reject(new Error('Hubspot Error (HTTP '+resp.statusCode+'). Details:\n'+body ))
        }
      }
    })
  })
};


/**
  Gets the most recently modified contacts from Hubspot.
  @param {integer} offset This is used to get the next page of results.
  Each request will return an offset in the response. Use that offset in the
  URL of your next request to get the next page of results.
  @param {integer} count objects to return
  @param {boolean} flatten optional parameter indicating whether to flatten the
  property output and just return simple objects containing the current values
  (defaults to true).
*/
Hubspot.prototype.getRecentlyModifiedContacts = function(offset, count, flatten){
  var self = this;
  return new Promise(function(resolve, reject){
    var qs = {};
    if(!_.isNil(offset)){ qs.offset = offset };
    if(!_.isNil(count)){ qs.count = count };
    self.baseReq({method: 'GET', url: '/contacts/v1/lists/recently_updated/contacts/recent', qs: qs },
    function(err, resp, body){
      if(err){
        reject(err);
      } else {
        if(resp.statusCode == 200){
          if(_.isNil(flatten) || flatten){
            resolve({
              hasMore: body.hasMore,
              offset: body.offset,
              total: body.total,
              results: _flattenResults(body.contacts)
            });
          } else {
            resolve(body);
          }

        } else {
          reject(new Error('Hubspot Error (HTTP '+resp.statusCode+'). Details:\n'+body ))
        }
      }
    })
  })
};


/**
  Gets the most recently created contacts from Hubspot.
  @param {integer} offset This is used to get the next page of results.
  Each request will return an offset in the response. Use that offset in the
  URL of your next request to get the next page of results.
  @param {integer} count objects to return
  @param {boolean} flatten optional parameter indicating whether to flatten the
  property output and just return simple objects containing the current values
  (defaults to true).
*/
Hubspot.prototype.getRecentlyCreatedContacts = function(offset, count, flatten){
  var self = this;
  return new Promise(function(resolve, reject){
    var qs = {};
    if(!_.isNil(offset)){ qs.offset = offset };
    if(!_.isNil(count)){ qs.count = count };
    self.baseReq({method: 'GET', url: '/contacts/v1/lists/all/contacts/recent', qs: qs },
    function(err, resp, body){
      if(err){
        reject(err);
      } else {
        if(resp.statusCode == 200){
          if(_.isNil(flatten) || flatten){
            resolve({
              hasMore: body.hasMore,
              offset: body.offset,
              total: body.total,
              results: _flattenResults(body.contacts)
            });
          } else {
            resolve(body);
          }

        } else {
          reject(new Error('Hubspot Error (HTTP '+resp.statusCode+'). Details:\n'+body ))
        }
      }
    })
  })
};


/**
  Searches for contacts based on a search term that matches part of the contact's name,
  company name or email address.
  @param {string} searchTerm Text used to match part of the name, company name or email of a contact.
  @param {integer} offset This is used to get the next page of results.
  Each request will return an offset in the response. Use that offset in the
  URL of your next request to get the next page of results.
  @param {integer} count objects to return
  @param {boolean} flatten optional parameter indicating whether to flatten the
  property output and just return simple objects containing the current values
  (defaults to true).
*/
Hubspot.prototype.searchContacts = function(searchTerm, offset, count, flatten){
  var self = this;
  return new Promise(function(resolve, reject){
    var qs = {};
    if(_.isNil(searchTerm)){ reject(new Error('A search term is required for searching contacts.'))} else { qs.q = searchTerm };
    if(!_.isNil(offset)){ qs.offset = offset };
    if(!_.isNil(count)){ qs.count = count };
    self.baseReq({method: 'GET', url: '/contacts/v1/search/query', qs: qs },
    function(err, resp, body){
      if(err){
        reject(err);
      } else {
        if(resp.statusCode == 200){
          if(_.isNil(flatten) || flatten){
            resolve({
              hasMore: body.hasMore,
              offset: body.offset,
              total: body.total,
              results: _flattenResults(body.contacts)
            });
          } else {
            resolve(body);
          }

        } else {
          reject(new Error('Hubspot Error (HTTP '+resp.statusCode+'). Details:\n'+body ))
        }
      }
    })
  })
};


/**
  Given an input JSON body containing results, this method flattens the 'properties'
  attribute and puts the property name/value pairs into each return object.

  @example
  { results: [
    {
      properties: {
        foo: { value: 'a' },
        bar: { value: 'b' }
      }
    }
  ],
  }
  ...becomes
  { results: [
    {
      foo: 'a',
      bar: 'b'
    }
  ],
  }
*/
function _flattenResults(results){
  if(results){
    var newresults = [];
    _.each(results, function(old){
      var obj = {};
      _.each(old.properties, function(val, key){
        obj[key] = val.value;
      });
      newresults.push(obj);
    });

    return newresults;
  } else {
    return results;
  }
}


_exp(Hubspot);
