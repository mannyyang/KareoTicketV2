(function () {

   'use strict';

    /*
     * GET home page.
     */
    var cache = require('memory-cache');
    var async = require('async');
    var moment = require('moment');
    var podio = require('../podio');

    exports.index = function(req, res){
    	res.render('index', {
                currItems: podio.getProcessedProjects(),
                moment: moment,
                podio: podio
            });
    };

    exports.update = function(req, res){
        async.series([
            function(callback){
                podio.updateProcessedProjects(callback);
            },
            function(callback){
                res.send({success: true});
                callback(null, 'two');
            }
        ]);
    };

}());
