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
    app.post('/', function(req, res){

        debugger;

        // podio.addFile(req.files.attachments.name, req.files.attachments.path);
        // podio.addProject(req.body);
        // console.log(req.files);
        // res.send(req.body);
    });
    app.post('/api/addfile', function(req, res){

        var filePath = req.files.files[0].path;
        var fileName = req.files.files[0].name;

        debugger;

        fs.readFile(filePath, function (err, data) {
            var newPath = __dirname + "/tempUploads/" + fileName;
            fs.writeFile(newPath, data, function (err) {
                console.log("file written \n" + data);
                podio.addFile(fileName, newPath);
                res.send({});
            });
        });


    });

    // Start Express Server
    http.createServer(app).listen(app.get('port'), function(){
      console.log("Express server listening on port " + app.get('port'));
    });

}());
