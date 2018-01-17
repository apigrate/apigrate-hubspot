const _ = _rqr('lodash');
var request = _rqr('request');


//Support for Built.io
function _rqr(lib){ return typeof $require != 'undefined' ? $require(lib) : require(lib); }
function _exp(constr){ if(typeof $export != 'undefined'){ $export(null, constr); } else { module.exports=constr; } }

var LOGGER = {info: console.log, error: console.error};

/**
  A promise-based NodeJS connector for accessing the Hubspot API.
  Provides HAPIKEY-based access to the Hubspot API.

  @param {string} hapikey granting access to the Hubspot API.
  @param {object} logger an optional logger that has a .info(msg) and .error(msg) method
  @version 1.1.3
*/
function Hubspot(hapikey, logger){
  this.baseReq = request.defaults({
    baseUrl: 'https://api.hubapi.com',
    qs:{ hapikey: hapikey},
    json: true
  });
  if(logger){
    LOGGER = logger;
  }
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
  var qs = {};
  return self._getEntities('Company Property Group', '/properties/v1/companies/groups/', qs, false );

};


// Company Properties...........................................................


/**
  Gets all company properties from Hubspot.
*/
Hubspot.prototype.getCompanyProperties = function(){
  var self = this;
  var qs = {};
  return self._getEntities('Company Property', '/properties/v1/companies/properties', qs, false );

};


Hubspot.prototype.getCompanyProperty = function(name){
  var self = this;
  var endpoint = '/properties/v1/companies/properties/named/'+name;
  var qs = {};
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
  var qs = {};
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
  var qs = {};
  if(!_.isNil(offset)){ qs.offset = offset; }
  if(!_.isNil(count)){ qs.count = count; }
  return self._getEntities('Company', '/companies/v2/companies/recent/created', qs, flatten, 'results', _getCompanyFields );

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
  var qs = {};
  if(_.isNil(companyId)){ return Promise.reject(new Error('A company id is required.')); }
  return self._getEntity('Company', endpoint, qs, flatten, _getCompanyFields);

};

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
  var qs = {};
  return self._getEntities('Contact Property Group', '/properties/v1/contacts/groups', qs, false );

};


// Contact Properties...........................................................


/**
  Gets all contact properties from Hubspot.
*/
Hubspot.prototype.getContactProperties = function(){
  var self = this;
  var qs = {};
  return self._getEntities('Contact Property', '/properties/v1/contacts/properties', qs, false );

};


Hubspot.prototype.getContactProperty = function(name){
  var self = this;
  var endpoint = '/properties/v1/contacts/properties/named/'+name;
  var qs = {};
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
  var qs = {};
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
  var qs = {};
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
  var qs = {};
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
  var qs = {};
  if(_.isNil(vid)){ Promise.reject(new Error('A contact id is required.')); }
  var endpoint = 'contacts/v1/contact/vid/'+vid+'/profile';
  return self._getEntity('Contact', endpoint, qs, flatten, _getContactFields);

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

        if(resp.statusCode == 200){
          if(_.isNil(flatten) || flatten){
            resolve( _flattenResults(body, fieldFct) );

          } else {
            resolve(body);
          }

        } else if(resp.statusCode == 404){
          resolve({});

        } else {
          reject(new Error('Hubspot Error (HTTP '+resp.statusCode+') getting '+entityName+'(s). Details:\n'+JSON.stringify(body) ));
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

    self.baseReq({method: 'GET', url: endpointUrl, qs: qs },
    function(err, resp, body){
      if(err){
        reject(err);
      } else {

        if(resp.statusCode == 200){
          if(_.isNil(flatten) || flatten){
            var result = {};
            if(body){
              if(body.hasMore){ result.hasMore = body.hasMore; }
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
          reject(new Error('Hubspot Error (HTTP '+resp.statusCode+') getting '+entityName+'(s). Details:\n'+JSON.stringify(body) ));
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
        if(resp.statusCode == 200){
          if(body){
            resolve(body);
          } else {
            resolve(resp);
          }

        } else {
          reject(new Error('Hubspot Error (HTTP '+resp.statusCode+') creating '+entityName+'. Details:\n'+JSON.stringify(body) ));
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
    target.formSubmissions = src['associated-company'];
  }
}

function _getCompanyFields(src, target){
  target.companyId = src.companyId;
  target.isDeleted = src.isDeleted;
}

_exp(Hubspot);
