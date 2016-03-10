'use strict';

var events = require('events');
var util = require('util');
var path = require('path');

var debuglog = require('devebot').debug('databoard');
var bodyParser = require('body-parser');
var session = require('express-session');

var configBuilderClass = require('../helpers/config-builder.js');

var Service = function(params) {
  debuglog(' + constructor begin ...');
  
  Service.super_.call(this);

  params = params || {};

  var self = this;
  
  self.getSandboxName = function() {
    return params.sandboxname;
  };
  
  var loggingFactory = params.loggingFactory;
  self.logger = loggingFactory.getLogger();
  
  var webserverTrigger = params.webserverTrigger;
  var apporo = webserverTrigger.getApporo();
  var express = webserverTrigger.getExpress();
  var configBuilder = new configBuilderClass(params);
  
  var app = express();
  app.use(session({ 
    secret: 's3cr3tk3yf0rw3bs3rv3r',
    saveUninitialized: true,
    resave: true
  }));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(configBuilder.buildRouter());
  app.use('/assets', express.static(path.join(__dirname, '../../public/assets')));
  
  apporo.use('/databoard', app);

  self.getServiceInfo = function() {
    return {};
  };
  
  debuglog(' - constructor end!');
};

Service.argumentSchema = {
  "id": "/databoardService",
  "type": "object",
  "properties": {
    "sandboxname": {
      "type": "string"
    },
    "sandboxconfig": {
      "type": "object"
    },
    "profileconfig": {
      "type": "object"
    },
    "generalconfig": {
      "type": "object"
    },
    "loggingFactory": {
      "type": "object"
    },
    "datamodelService": {
      "type": "object"
    },
    "webserverTrigger": {
      "type": "object"
    }
  }
};

util.inherits(Service, events.EventEmitter);

module.exports = Service;
