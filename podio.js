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
		addProject: function(project){
			console.log(project);
		},
		addFile: function(fileName, fileSource){
			var options = {
				app_id: 8527312,
				auth: podioClassGlobal.token,
				source: fileSource,
				filename: fileName
				// body: {
				// 	source: fileSource,
				// 	filename: fileName
				// }
			};

			podioClassGlobal.podioAPI.filesUploadFile(options, function (err, result) {
				console.log(result);
			});
		},
		createProject: function(project){
			var contactOptions = {
				auth: podioClassGlobal.token,
				space_id: 1444230,
				body: {
					name: project.owner.name,
					mail: [project.owner.email]
				}
			};

			podioClassGlobal.podioAPI.contactsCreateSpaceContact(contactOptions, function(err, result){
				console.log('contact created');
				if (err)
					console.log(err);

				var itemOptions = {
					app_id: 8527312,
					auth: podioClassGlobal.token,
					body: {
						fields: {
							"project-title": project.projectTitle,
							"priority": parseInt(project.priority),
							"stage": parseInt(project.stage),
							"project-owner": result.body.profile_id,
							"start-and-finish-dates": project.deadline + " 00:00:00",
							"project-description": project.projectDescription
						}
					}
				};

				podioClassGlobal.podioAPI.itemsAddNewItem(itemOptions, function(err, result){
					if (err)
						console.err(err);
					console.log(result);
				});
				console.log(result);
			});
		},
	});

	var Podio = new podio(PodioAPI, config.podio.username, config.podio.password);
	console.log('intializing podio api');
	Podio.on('token', function(){
		Podio.getAllItems();
	});

	exports.getItems = function(res, req){

		return Podio.getItems();
	};

	exports.addProject = function(project){
		Podio.createProject(project);
	};

	exports.addFile = function(fileName, fileSource){
		Podio.addFile(fileName, fileSource);
	};

})();
