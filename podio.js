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
			podioClassGlobal.options = {
				app_id: '8527312',
				auth: ''
			};

			podioClassGlobal.currentProjects = [];

			podioClassGlobal.podioAPI.authenticate({
				username: username,
				password: password
			}, function(err, result) {
				if (err)
					return console.error (err);
				podioClassGlobal.options.auth = result.auth;
				cache.put('token', result.auth);
				console.log('token received');
				podioClassGlobal.emit('token');
			});

		},
		getCurrentProjects: function(){
			var cusOptions = podioClassGlobal.options;
				cusOptions.view_id = '8128188';

			podioClassGlobal.podioAPI.itemsFilterItemsByView(podioClassGlobal.options, function (err, result) {
				if (err)
					return console.error(err);

				console.log('grabbed all items');
				podioClassGlobal.emit('currentProjects', result.body.items);
				return result.body.items;
			});
		},
		addMilestones: function(project){

			var currProject = project;
			currProject.milestones = [];
			var projMilestones = [];

			for (var i = 0; i < project.fields.length; i++){
				if (project.fields[i].label === 'Milestones' ){
					projMilestones = project.fields[i].values;
				}
			}

			async.eachSeries(projMilestones, function(milestone, callback) {

				var cusOptions = podioClassGlobal.options;
					cusOptions.item_id =  milestone.value.item_id;

				podioClassGlobal.podioAPI.itemsGetItem(cusOptions, function(err, result){
					if (err)
						return console.error(err);

					currProject.milestones.push(result.body);
					callback();
				});

			}, function(err){
				// if any of the file processing produced an error, err would equal that error
				if( err ) {
				// One of the iterations produced an error.
				// All processing will now stop.
					console.log('A milestone has failed to process.');
				} else {
					podioClassGlobal.currentProjects.push(currProject);
					console.log('All milestones have been processed successfully');
				}
			});

		},
		getItems: function(){
			return podioClassGlobal.allProjects;
		},
	});

	var Podio = new podio(PodioAPI, config.podio.username, config.podio.password);
	console.log('intializing podio api');

	Podio.on('token', function(){
		Podio.getCurrentProjects();
	});

	Podio.on('currentProjects', function(currentProjects){

		for (var i = 0; i < currentProjects.length; i++){
			Podio.addMilestones(currentProjects[i]);
		}

	});

	exports.getItem = function(itemID){
		return Podio.getItem(itemID);
	};

	exports.getItems = function(req, res){
		return Podio.getItems();
	};

	exports.getAllItems = function(req, res){
		return Podio.getAllItems();
	};

})();
