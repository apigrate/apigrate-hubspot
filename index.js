/*
  Copyright 2018 Apigrate LLC

  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at

      http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
*/
const _ = require('lodash');
var request = require('request');

/**
  A promise-based NodeJS connector for accessing the Hubspot API.
  Provides HAPIKEY-based access to the Hubspot API.

  @param {string} hapikey granting access to the Hubspot API.
  @param {object} logger an optional logger that has a .info(msg) and .error(msg) method
  @version 1.5.0
*/
function Hubspot(hapikey, logger){
  this.baseReq = request.defaults({
    baseUrl: 'https://api.hubapi.com',
    qs:{ hapikey: hapikey},
    json: true
  });
  this.hapikey = hapikey;
  if(!logger){
    //Don't break when no logger.
    logger = {};
    logger.error = console.error;
    logger.warn = console.warn;
    logger.info = function(){};
    logger.debug = function(){};
    logger.silly = function(){};
  }
  this.LOGGER = logger;
}


// Company Property Groups......................................................


/**
  Create a company property group
  @param {object} toSave
  @example
  {
  "name": "a_new_custom_group",
  "displayName": "A New Custom Group"
  }
*/
Hubspot.prototype.createCompanyPropertyGroup = function(toSave){
  var self = this;
  return self._createEntity("Company Property Group", '/properties/v1/companies/groups', toSave );
};

/**
  Gets all company property groups from Hubspot.
*/
Hubspot.prototype.getCompanyPropertyGroups = function(){
  var self = this;
  var qs = { hapikey: self.hapikey};
  return self._getEntities('Company Property Group', '/properties/v1/companies/groups/', qs, false );

};


// Company Properties...........................................................


/**
  Gets all company properties from Hubspot.
*/
Hubspot.prototype.getCompanyProperties = function(){
  var self = this;
  var qs = { hapikey: self.hapikey};
  return self._getEntities('Company Property', '/properties/v1/companies/properties', qs, false );

};


Hubspot.prototype.getCompanyProperty = function(name){
  var self = this;
  var endpoint = '/properties/v1/companies/properties/named/'+name;
  var qs = { hapikey: self.hapikey};
  return self._getEntity('Company Property', endpoint, qs, false);

};


/**
  Create a company property
  @param {object} toSave
  @example
  {
    "name": "another_example_property",
    "label": "Another Example Property",
    "description": "Another property being created as an example.",
    "groupName": "companyinformation",
    "type": "string",
    "fieldType": "text"
  }
*/
Hubspot.prototype.createCompanyProperty = function(toSave){
  var self = this;
  return self._createEntity('Company Property', '/properties/v1/companies/properties', toSave);

};


// Companies....................................................................

/**
  Gets all companies from Hubspot.
  @param {integer} offset This is used to get the next page of results.
  Each request will return an offset in the response. Use that offset in the
  URL of your next request to get the next page of results.
  @param {integer} limit # objects to return (max 250)
  @param {array} properties array of property names to include in the response.
  If excluded, only the company id will be returned.
  @param {boolean} flatten optional parameter indicating whether to flatten the
  property output and just return simple objects containing the current values
  (defaults to true).

*/
Hubspot.prototype.getAllCompanies = function(offset, limit, properties, flatten){
  var self = this;
  var qs = { hapikey: self.hapikey};
  if(!_.isNil(offset)){ qs.offset = offset; }
  if(!_.isNil(limit)){ qs.limit = limit; }
  if(!_.isNil(properties)){ qs.properties = properties; }
  return self._getEntities('Company', '/companies/v2/companies/paged', qs, flatten, 'companies', _getCompanyFields );

};

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
  var qs = { hapikey: self.hapikey};
  if(!_.isNil(offset)){ qs.offset = offset; }
  if(!_.isNil(count)){ qs.count = count; }
  return self._getEntities('Company', '/companies/v2/companies/recent/modified', qs, flatten, 'results', _getCompanyFields );

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
  var qs = { hapikey: self.hapikey };
  if(!_.isNil(offset)){ qs.offset = offset; }
  if(!_.isNil(count)){ qs.count = count; }
  return self._getEntities('Company', '/companies/v2/companies/recent/created', qs, flatten, 'results', _getCompanyFields );

};


Hubspot.prototype.getCompaniesByDomain = function(domain, offset, limit, flatten){
  var self = this;
  var qs = { hapikey: self.hapikey };
  //if(!_.isNil(offset)){ qs.offset = offset; }
  //if(!_.isNil(limit)){ qs.limit = limit; }
  return self._getEntitiesByPost('Company', `/companies/v2/domains/${domain}/companies`, qs, {
    limit: limit || 1,
    requestOptions: {
      properties: [
        "domain",
        "createdate",
        "name",
        "hs_lastmodifieddate"
      ]
    },
    offset: {
      isPrimary: true,
      companyId: offset || 0
    }
  }, flatten, 'results', _getCompanyFields );

};


/**
  Gets a company by its id.
  @param {string} companyId The company id.
  @param {boolean} flatten optional parameter indicating whether to flatten the
  property output and just return simple objects containing the current values
  (defaults to true).
*/
Hubspot.prototype.getCompanyById = function(companyId, flatten){
  var self = this;
  var endpoint = 'companies/v2/companies/'+companyId;
  var qs = { hapikey: self.hapikey};
  if(_.isNil(companyId)){ return Promise.reject(new Error('A company id is required.')); }
  return self._getEntity('Company', endpoint, qs, flatten, _getCompanyFields);

};

/**
  Creates a company for the given object.
  @param toSave the company to save
  @param {boolean} splay indicates the toSave entity needs to be "splayed out"
  into the hubspot name-value-pair format. When true, any returned object will be
  "unsplayed" (i.e. flattened) to maintain consistency with the caller.

*/
Hubspot.prototype.createCompany = function(toSave, splay){
  var self = this;

  var saveThis = toSave;
  if(splay){
    saveThis = _splay(toSave);
    self.LOGGER.debug('After splay %s', JSON.stringify(saveThis, null, 2));
  }
  return self._createEntity('Company', '/companies/v2/companies', saveThis)
  .then(function(result){
    if(splay){
      return Promise.resolve(_flattenResults(result, _getCompanyFields));
    } else {
  	  return Promise.resolve(result);
    }
  })
  .catch(function(err){
  	return Promise.reject(err);
  });

}


/**

  @param {integer} companyId
  @param {object} toSave
  @param {boolean} splay indicates the toSave entity needs to be "splayed out"
  into the hubspot name-value-pair format. When true, any returned object will be
  "unsplayed" (i.e. flattened) to maintain consistency with the caller.
*/
Hubspot.prototype.updateCompany = function(companyId, toSave, splay){
  var self = this;

  var saveThis = toSave;
  if(splay){
    saveThis = _splay(toSave);
  }
  return self._updateEntity('Company', '/companies/v2/companies/'+encodeURIComponent(companyId), saveThis)
  .then(function(result){
    if(splay){
      return Promise.resolve(_flattenResults(result, _getCompanyFields));
    } else {
  	  return Promise.resolve(result);
    }
  })
  .catch(function(err){
  	return Promise.reject(err);
  });
}

// Contact Property Groups......................................................


/**
  Create a contact property group
  @param {object} toSave
  @example
  {
  "name": "a_new_custom_group",
  "displayName": "A New Custom Group"
  }
*/
Hubspot.prototype.createContactPropertyGroup = function(toSave){
  var self = this;
  return self._createEntity("Contact Property Group", '/properties/v1/contacts/groups', toSave );
};


/**
  Gets all contact property groups from Hubspot.
*/
Hubspot.prototype.getContactPropertyGroups = function(){
  var self = this;
  var qs = { hapikey: self.hapikey};
  return self._getEntities('Contact Property Group', '/properties/v1/contacts/groups', qs, false );

};


// Contact Properties...........................................................


/**
  Gets all contact properties from Hubspot.
*/
Hubspot.prototype.getContactProperties = function(){
  var self = this;
  var qs = { hapikey: self.hapikey};
  return self._getEntities('Contact Property', '/properties/v1/contacts/properties', qs, false );

};


Hubspot.prototype.getContactProperty = function(name){
  var self = this;
  var endpoint = '/properties/v1/contacts/properties/named/'+name;
  var qs = { hapikey: self.hapikey};
  return self._getEntity('Contact Property', endpoint, qs, false);

};


/**
  Create a contact property
  @param {object} toSave
  @example
  {
    "name": "another_example_property",
    "label": "Another Example Property",
    "description": "Another property being created as an example.",
    "groupName": "contactinfo",
    "type": "string",
    "fieldType": "text"
  }
*/
Hubspot.prototype.createContactProperty = function(toSave){
  var self = this;
  return self._createEntity('Contact Property', '/properties/v1/contacts/properties', toSave);
};

// Contacts.....................................................................


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
  var qs = { hapikey: self.hapikey};
  if(!_.isNil(offset)){ qs.offset = offset; }
  if(!_.isNil(count)){ qs.count = count; }
  return self._getEntities('Contact', '/contacts/v1/lists/recently_updated/contacts/recent', qs, flatten, 'contacts', _getContactFields);

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
  var qs = { hapikey: self.hapikey};
  if(!_.isNil(offset)){ qs.offset = offset; }
  if(!_.isNil(count)){ qs.count = count; }
  return self._getEntities('Contact', '/contacts/v1/lists/all/contacts/recent', qs, flatten, 'contacts', _getContactFields);

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
  var qs = { hapikey: self.hapikey};
  if(_.isNil(searchTerm)){ return Promise.reject(new Error('A search term is required for searching contacts.')); } else { qs.q = searchTerm; }
  if(!_.isNil(offset)){ qs.offset = offset; }
  if(!_.isNil(count)){ qs.count = count; }
  return self._getEntities('Contact', '/contacts/v1/search/query', qs, flatten, 'contacts', _getContactFields);

};


/**
  Gets a contact by its id.
  @param {string} vid The contact id.
  @param {boolean} flatten optional parameter indicating whether to flatten the
  property output and just return simple objects containing the current values
  (defaults to true).
*/
Hubspot.prototype.getContactById = function(vid, flatten){
  var self = this;
  var qs = { hapikey: self.hapikey};
  if(_.isNil(vid)){ return Promise.reject(new Error('A contact id is required.')); }
  var endpoint = 'contacts/v1/contact/vid/'+vid+'/profile';
  return self._getEntity('Contact', endpoint, qs, flatten, _getContactFields);

};

/**
  Create a contact
  @param {object} toSave
  @param {boolean} splay indicates the toSave entity needs to be "splayed out"
  into the hubspot name-value-pair format. When true, any returned object will be
  "unsplayed" (i.e. flattened) to maintain consistency with the caller.
*/
Hubspot.prototype.createContact = function(toSave, splay){
  var self = this;

  var saveThis = toSave;
  if(splay){
    saveThis = _splay(toSave, 'property');
  }
  self.LOGGER.debug(JSON.stringify(saveThis,null,2))

  return self._createEntity('Contact', '/contacts/v1/contact', saveThis)
  .then(function(result){
    if(splay){
      return Promise.resolve(_flattenResults(result, _getContactFields));
    } else {
  	  return Promise.resolve(result);
    }
  })
  .catch(function(err){
  	return Promise.reject(err);
  });
}

/**

  Updates a contact. Note that this method does NOT return the contact after update. You need to
  fetch it by id again to get calculated fields if needed.
  @param {integer} contactId
  @param {object} toSave
  @param {boolean} splay indicates the toSave entity needs to be "splayed out"
  into the hubspot name-value-pair format. When true, any returned object will be
  "unsplayed" (i.e. flattened) to maintain consistency with the caller.
*/
Hubspot.prototype.updateContact = function(contactId, toSave, splay){
  var self = this;

  var saveThis = toSave;
  if(splay){
    saveThis = _splay(toSave, 'property');
  }

  return new Promise(function(resolve, reject){

    //Uses POST, unlike some other updates...
    return self.baseReq({method: 'POST', url: '/contacts/v1/contact/vid/'+encodeURIComponent(contactId)+'/profile', body: saveThis },
    function(err, resp, body){
      if(err){
        reject(err);
      } else {
        if(resp.statusCode == 204){
          //No body will be present per api spec.
          resolve(resp);

        } else {
          reject(new Error('Hubspot Error (HTTP '+resp.statusCode+') updating Contact. Details:\n'+JSON.stringify(body) ));
        }
      }
    });
  });

}

/**
  Assigns a contact to a company. If contact is already assigned to another company
   it will be moved.
*/
Hubspot.prototype.assignContactToCompany = function(contactId, companyId){
  var self = this;

  return new Promise(function(resolve, reject){

    return self.baseReq({method: 'PUT', url: '/companies/v2/companies/'+encodeURIComponent(companyId)+'/contacts/'+encodeURIComponent(contactId)},
    function(err, resp, body){
      if(err){
        reject(err);
      } else {
        if(resp.statusCode == 200){
          if(body){
            resolve(body);
          } else {
            resolve(resp);
          }

        } else {
          reject(new Error('Hubspot Error assigning contact '+ contactId +' to company '+ companyId +'. Reason: '+ body.message+'. \nHTTP '+resp.statusCode+' \n'+JSON.stringify(body) ));
        }
      }
    });
  });

};

// Internal Functions...........................................................

/**
  Internal standard get single entity handler for hubspot api calls.
*/
Hubspot.prototype._getEntity = function(entityName, endpointUrl, qs, flatten, fieldFct){
  var self = this;
  return new Promise(function(resolve, reject){

    self.baseReq({method: 'GET', url: endpointUrl, qs: qs },
    function(err, resp, body){

      if(err){
        reject(err);
      } else {
        self.LOGGER.silly('Raw Response: %s', JSON.stringify(body));

        if(resp.statusCode == 200){
          if(_.isNil(flatten) || flatten){
            resolve( _flattenResults(body, fieldFct) );

          } else {
            resolve(body);
          }

        } else if(resp.statusCode == 404){
          resolve({});

        } else {
          reject(new Error('Hubspot Error getting '+entityName+'. Reason: '+ body.message+'. \nHTTP '+resp.statusCode+' \n'+JSON.stringify(body) ));
        }
      }
    });
  });
};


/**
  Internal standard getEntities/search handler for hubspot api calls.
*/
Hubspot.prototype._getEntities = function(entityName, endpointUrl, qs, flatten, collectionName, fieldFct){
  var self = this;
  return new Promise(function(resolve, reject){

    self.baseReq({method: 'GET', url: endpointUrl, qs: qs, useQuerystring: true, qsStringifyOptions: { arrayFormat: 'repeat' } },
    function(err, resp, body){
      if(err){
        reject(err);
      } else {
        self.LOGGER.silly('Raw Response: %s', JSON.stringify(body));

        if(resp.statusCode == 200){
          if(_.isNil(flatten) || flatten){
            var result = {};
            if(body){
              if(body.hasMore){ result.hasMore = body.hasMore; }
              if(body['has-more']){ result.hasMore = body['has-more']; }
              if(body.offset){ result.offset = body.offset; }
              if(body.total){ result.total = body.total; }
              result.results = _flattenResults(body[collectionName], fieldFct);
            }
            resolve(result);
          } else {
            resolve(body);
          }

        } else if(resp.statusCode == 404){
          resolve([]);

        } else {
          reject(new Error('Hubspot Error getting '+entityName+'(s). Reason: '+ (body ? body.message : resp.body)+'. \nHTTP '+resp.statusCode+' \n'+JSON.stringify(body) ));
        }
      }
    });
  });
};


Hubspot.prototype._getEntitiesByPost = function(entityName, endpointUrl, qs, payload, flatten, collectionName, fieldFct){
  var self = this;
  return new Promise(function(resolve, reject){

    self.baseReq({method: 'POST', url: endpointUrl, qs: qs, useQuerystring: true, qsStringifyOptions: { arrayFormat: 'repeat' }, body: payload, json: true },
    function(err, resp, body){
      if(err){
        reject(err);
      } else {
        self.LOGGER.silly('Raw Response: %s', JSON.stringify(body));

        if(resp.statusCode == 200){
          if(_.isNil(flatten) || flatten){
            var result = {};
            if(body){
              if(body.hasMore){ result.hasMore = body.hasMore; }
              if(body['has-more']){ result.hasMore = body['has-more']; }
              if(body.offset){ result.offset = body.offset; }
              if(body.total){ result.total = body.total; }
              result.results = _flattenResults(body[collectionName], fieldFct);
            }
            resolve(result);
          } else {
            resolve(body);
          }

        } else if(resp.statusCode == 404){
          resolve([]);

        } else {
          reject(new Error('Hubspot Error getting '+entityName+'(s). Reason: '+ (body ? body.message : resp.body)+'. \nHTTP '+resp.statusCode+' \n'+JSON.stringify(body) ));
        }
      }
    });
  });
};



/**
  Internal standard create handler for hubspot api calls.
*/
Hubspot.prototype._createEntity = function(entityName, endpointUrl, toSave){
  var self = this;
  return new Promise(function(resolve, reject){

    return self.baseReq({method: 'POST', url: endpointUrl, body: toSave },
    function(err, resp, body){
      if(err){
        reject(err);
      } else {
        self.LOGGER.silly('Raw Response: %s', JSON.stringify(body))

        if(resp.statusCode == 200){
          if(body){
            resolve(body);
          } else {
            resolve(resp);
          }

        } else {
          reject(new Error('Hubspot Error creating '+entityName+'. Reason: '+ body.message+'. \nHTTP '+resp.statusCode+' \n'+JSON.stringify(body) ));
        }
      }
    });
  });
};


/**
  Internal standard create handler for hubspot api calls.
*/
Hubspot.prototype._updateEntity = function(entityName, endpointUrl, toSave){
  var self = this;
  return new Promise(function(resolve, reject){
    return self.baseReq({method: 'PUT', url: endpointUrl, body: toSave },
    function(err, resp, body){
      if(err){
        reject(err);
      } else {
        self.LOGGER.silly('Raw Response: %s', JSON.stringify(body))

        if(resp.statusCode == 200){
          if(body){
            resolve(body);
          } else {
            resolve(resp);
          }

        } else {
          reject(new Error('Hubspot Error updating '+entityName+'. Reason: '+ body.message+'. \nHTTP '+resp.statusCode+' \n'+JSON.stringify(body) ));
        }
      }
    });
  });
};

/**
  Given an array or an object, this method flattens the 'properties'
  collection on the members or the object and puts the property name/value fields into each return object.
  @param {array|object} results an array of objects or a single object to flatten
  @param {function} getEntitySpecificFields a function accepting  src and target parameters to
  allow additional fields to be set onto the return object.
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
function _flattenResults(results, getEntitySpecificFields ){
  if(results){
    if(_.isArray(results)){
      //Flatten the array of objects
      var newresults = [];
      _.each(results, function(old){
        var obj = {};
        _.each(old.properties, function(val, key){
          obj[key] = val.value;
        });

        if(getEntitySpecificFields){
          getEntitySpecificFields.call(null, old, obj);
        }
        newresults.push(obj);
      });

      return newresults;
    } else {
      //Flatten the object.
      var obj = {};
      _.each(results.properties, function(val, key){
        obj[key] = val.value;
      });

      if(getEntitySpecificFields){
        getEntitySpecificFields.call(null, results, obj);
      }
      return(obj);
    }
  } else {
    return results;
  }
}

/**
  Takes a hashed object and return an object with the properties splayed out
  in an array of key-value-pair objects. For example:
  {
    "foo":"abc",
    "bar":123
  }
  would become...
  {
    properties:[
      {
        name: "foo",
        value: "abc",
      },
      {
        name: "bar",
        value: 123
      }
    ]
  }
*/
function _splay(toSave, name){
  var saveThis = {properties:[]};
  if(!name) name = 'name';
  _.each(toSave, function(v, k){
    var prop = {};
    prop[name] = k;
    prop.value = v;
    saveThis.properties.push(prop);
  });
  return saveThis;
}


function _getContactFields(src, target){
  target.vid = src.vid;
  target.canonicalVid = src['canonical-vid'];
  target.isContact = src['is-contact'];
  if(!_.isNil(src['identity-profiles'])){
    target.identityProfiles = src['identity-profiles'];
  }
  if(!_.isNil(src['list-memberships'])){
    target.listMemberships = src['list-memberships'];
  }
  if(!_.isNil(src['form-submissions'])){
    target.formSubmissions = src['form-submissions'];
  }
  if(!_.isNil(src['associated-company'])){
    target.company = src['associated-company'];
  }
}

function _getCompanyFields(src, target){
  target.companyId = src.companyId;
  target.isDeleted = src.isDeleted;
  target.source = src.source;
}

module.exports=Hubspot;
