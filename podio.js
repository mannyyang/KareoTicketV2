(function(){

	"use strict";

	var config = require('./config');
	var cache = require('memory-cache');
	var podioAPI = require('podio-api');
	var PodioAPI = new podioAPI({ client_id: config.podio.clientID, client_secret: config.podio.clientSecret });
	var async = require('async');

	var podioClassGlobal = {};

	var podio = new Class(
	{
		Implements: [process.EventEmitter],
		initialize: function(podioAPI, username, password)
		{
			podioClassGlobal = this;
			podioClassGlobal.podioAPI = podioAPI;
			podioClassGlobal.token = "";

			podioClassGlobal.podioAPI.authenticate({
				username: username,
				password: password
			}, function(err, result) {
				if (err)
					return console.error (err);
				podioClassGlobal.token = result.auth;
				cache.put('token', result.auth);
				console.log('token received');
				podioClassGlobal.emit('token');
			});

		},
		getAllItems: function(){
			var options = {
				app_id: 8527312,
				auth: podioClassGlobal.token
			};

			podioClassGlobal.podioAPI.itemsFilterItems(options, function (err, result) {
				debugger;
				if (err) return console.error(err);
				podioClassGlobal.allProjects = result.body.items;
				cache.put('AllProjects', result.body.items);
				console.log('grabbed all items');
				return result.body.items;
			});
		},
		getItems: function(){
			return podioClassGlobal.allProjects;
		},
	});

	var Podio = new podio(PodioAPI, config.podio.username, config.podio.password);
	console.log('intializing podio api');
	Podio.on('token', function(){
		Podio.getAllItems();
	});

	exports.getItems = function(req, res){
		return Podio.getItems();
	};

	exports.getAllItems = function(req, res){
		async.series({
		    one: function(callback){
				var options = {
					app_id: 8527312,
					auth: podioClassGlobal.token
				};

				podioClassGlobal.podioAPI.itemsFilterItems(options, function (err, result) {
					if (err) return console.error(err);
					podioClassGlobal.allProjects = result.body.items;
					cache.put('AllProjects', result.body.items);
					console.log('grabbed all items');
					callback(null, result.body.items);
				});
		    }
		},
		function(err, results) {
			return results;
		});
	};

})();
