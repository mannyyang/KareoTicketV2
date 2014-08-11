(function () {
   'use strict';
}());

/*
 * GET home page.
 */
var cache = require('memory-cache');
var moment = require('moment');
var podio = require('../podio');

exports.index = function(req, res){
	res.render('index', {
            allItems: podio.getItems(),
            moment: moment
        });
};
