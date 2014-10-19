(function () {

   'use strict';

    /**
     * Module dependencies.
     */
    require('mootools');

    var config = require('./config'),
        express = require('express'),
        routes = require('./routes'),
        fs = require('fs'),
        http = require('http'),
        path = require('path'),
        podio = require('./podio');

    var app = express();

    app.configure(function(){
      app.set('port', config.webPort);
      app.set('views', __dirname + '/views');
      app.set('view engine', 'jade');
      app.use(express.favicon());
      app.use(express.logger('dev'));
      app.use(express.methodOverride());
      app.use(express.multipart());
      app.use(app.router);
      app.use(express.static(path.join(__dirname, 'public')));
    });

    app.configure('development', function(){
      app.use(express.errorHandler());
    });

    app.get('/', routes.index);

    // Start Express Server
    http.createServer(app).listen(app.get('port'), function(){
      console.log("Express server listening on port " + app.get('port'));
    });

}());
