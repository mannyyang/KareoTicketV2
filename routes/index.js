(function () {

   'use strict';

    /*
     * GET home page.
     */
    var cache = require('memory-cache');
    var moment = require('moment');
    var podio = require('../podio');

    exports.index = function(req, res){
    	res.render('index', {
                currItems: podio.getCurrentItems(),
                moment: moment,
                podio: podio
            });
    };

    exports.update = function(req, res){
        res.send(podio.getAllItems(req, res));
    };

}());
