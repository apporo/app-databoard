'use strict';

var events = require('events');
var util = require('util');
var path = require('path');

var lodash = require('devebot').pkg.lodash;
var debuglog = require('devebot').debug('databoard:configBuilder');

var Builder = function(params) {
  debuglog(' + constructor begin ...');

  var self = this;
  
  var datamodelService = params.datamodelService;
  var webserverTrigger = params.webserverTrigger;
  var express = webserverTrigger.getExpress();
  
  var cfgDefault = {
    'client': {
      'ng-admin': {
        homedir: "public/client/ng-admin-demo"
      }
    },
    'default': 'ng-admin'
  };
  var cfgDataboard = lodash.get(params, ['sandboxconfig', 'plugins', 'appDataboard'], cfgDefault);
  var clientList = cfgDataboard.client || cfgDefault.client;
  var clientDefault = cfgDataboard.default || cfgDefault.default;

  if (debuglog.isEnabled) {
    debuglog(' - the list of clients: %s; current: %s', JSON.stringify(clientList, null, 2), clientDefault);  
  }
  
  self.buildRouter = function() {
    var router = express.Router();
    
    router.route('/build/main1.js').get(function(req, res, next) {
      var out = 'var x = 100; console.log("x=", x);';
      res.setHeader('content-type', 'text/javascript');
      res.write(out);
      res.end();
    });
    
    router.use(express.static(path.join(__dirname, '../../' + clientList[clientDefault].homedir)));
    
    return router;
  };

  debuglog(' - constructor end!');
};

module.exports = Builder;
