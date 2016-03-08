'use strict';

var events = require('events');
var util = require('util');
var path = require('path');

var debuglog = require('devebot').debug('databoard');
var bodyParser = require('body-parser');
var session = require('express-session');

var Service = function(params) {
  Service.super_.call(this);

  params = params || {};

  var self = this;
  
  self.getSandboxName = function() {
    return params.sandboxname;
  };
  
  var sandboxconfig = params.sandboxconfig;
  
  var loggingFactory = params.loggingFactory;
  self.logger = loggingFactory.getLogger();
  
  var datamodelService = params.datamodelService;
  var webserverTrigger = params.webserverTrigger;
  var app = webserverTrigger.getApporo();
  var express = webserverTrigger.getExpress();

  var middleware = express();
  middleware.use(session({ 
    secret: 's3cr3tk3yf0rw3bs3rv3r',
    saveUninitialized: true,
    resave: true
  }));
  middleware.use(bodyParser.json());
  middleware.use(bodyParser.urlencoded({ extended: true }));
  
  middleware.use('/public', express.static(path.join(__dirname, '../../public')));
  
  app.use('/databoard', middleware);

  self.getServiceInfo = function() {
    return {};
  };
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
