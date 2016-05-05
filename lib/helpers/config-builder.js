'use strict';

var events = require('events');
var util = require('util');
var path = require('path');

var ejs = require('ejs');
var fs = require('fs');

var Devebot = require('devebot');
var lodash = Devebot.require('lodash');
var debug = Devebot.require('debug');
var debuglog = debug('databoard:configBuilder');

var Builder = function(params) {
  debuglog(' + constructor begin ...');

  var self = this;
  
  var datamodelService = params.datamodelService;
  var webserverTrigger = params.webserverTrigger;
  var express = webserverTrigger.getExpress();
  
  var cfgDefault = {
    'client': {
      'ng-admin': {
        homedir: 'public/client/ng-admin-demo',
        templateFile: __dirname + 'templates/ng-admin/config.tmpl.js'
      }
    },
    'default': 'ng-admin'
  };
  var cfgDataboard = lodash.get(params, ['sandboxConfig', 'plugins', 'appDataboard'], cfgDefault);
  var clientList = cfgDataboard.client || cfgDefault.client;
  var clientDefault = cfgDataboard.default || cfgDefault.default;

  if (debuglog.isEnabled) {
    debuglog(' - the list of clients: %s; current: %s', JSON.stringify(clientList, null, 2), clientDefault);  
  }

  var templateFile = clientList[clientDefault].templateFile;
  if (lodash.isEmpty(templateFile)) {
    templateFile = path.join(__dirname, 'templates/', clientDefault, 'config.tmpl.js');
  }

  var configTemplate = ejs.compile(fs.readFileSync(templateFile, 'utf8'));
  
  var configDataModel = {
    appName: 'Administration Dashboard',
    baseApiUrl: 'http://localhost:3000/',
    models: [
      {
        code: 'posts',
        variable: 'post',
        title: 'Posts',
      }
    ]
  };

  self.buildRouter = function() {
    var router = express.Router();
    
    router.route('/config.js').get(function(req, res, next) {
      res.setHeader('content-type', 'text/javascript');
      res.write(configTemplate(configDataModel));
      res.end();
    });
    
    router.use(express.static(path.join(__dirname, '../../' + clientList[clientDefault].homedir)));
    
    return router;
  };

  debuglog(' - constructor end!');
};

module.exports = Builder;
