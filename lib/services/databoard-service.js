'use strict';

var events = require('events');
var util = require('util');
var path = require('path');

var Devebot = require('devebot');
var lodash = Devebot.require('lodash');
var debug = Devebot.require('debug');

var debuglog = debug('databoard');

var configBuilderClass = require('../helpers/config-builder.js');

var Service = function(params) {
  debuglog(' + constructor begin ...');
  
  Service.super_.call(this);

  params = params || {};

  var self = this;
  
  self.getSandboxName = function() {
    return params.sandboxName;
  };
  
  self.logger = params.loggingFactory.getLogger();

  var cfgDataboard = lodash.get(params, ['sandboxConfig', 'plugins', 'appDataboard'], {});
  var contextPath = cfgDataboard.contextPath || '/databoard';

  var webserverTrigger = params.webserverTrigger;
  var express = webserverTrigger.getExpress();
  var position = webserverTrigger.getPosition();

  var configBuilder = new configBuilderClass(params);
  
  webserverTrigger.inject(express.static(path.join(__dirname, '../../public/assets')), 
    contextPath + '/assets', position.inRangeOfStaticFiles(), 'databoard-assets');

  webserverTrigger.inject(configBuilder.buildRouter(), 
    contextPath, position.inRangeOfMiddlewares(), 'databoard');

  self.getServiceInfo = function() {
    return {};
  };
  
  debuglog(' - constructor end!');
};

Service.argumentSchema = {
  "id": "databoardService",
  "type": "object",
  "properties": {
    "sandboxName": {
      "type": "string"
    },
    "sandboxConfig": {
      "type": "object"
    },
    "profileConfig": {
      "type": "object"
    },
    "generalConfig": {
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
