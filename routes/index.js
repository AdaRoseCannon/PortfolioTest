/* jshint node:true */
/* globals $ */

/*
 * GET home page.
 */
var fs = require('fs');
var generateImage = require('./generateImage');

exports.load = function (docRequested, req, res) {
	'use strict';
	require("./" + docRequested)(req, res, function (renderVars) {
		if (req.headers.accept && req.headers.accept.indexOf("application/json") !== -1) {
			console.log("Sending JSON");
			res.json(renderVars);
			return;
		}
		if (!renderVars.jade) {
			res.send(renderVars);
			return;
		}
		if (renderVars.jade) res.render(renderVars.jade, renderVars);
	});
};

exports.exists = function (name) {
	'use strict';
	if (fs.existsSync(__dirname + "/" + name + ".js")) {
		return true;
	}
	return false;
};

exports.index = function (req, res) {
	'use strict';
	res.setHeader("Cache-Control", "max-age=31556926");
	var renderVars = { title: 'Portfolio Site' };
	if (req.headers.accept && req.headers.accept.indexOf("application/json") !== -1) {
		res.json(renderVars);
		return;
	}
	res.render('index', renderVars);
};

exports.upload = function (req, res) {
	'use strict';
	var rawPath = fs.realpathSync(__dirname + "/../data/raw/");


	if (req.body.folder) {
		var folder = req.body.folder;

		for (var file in req.files) {
			fs.readFile(req.files[file].path, function (err, data) {
				var newPath = rawPath + "/" + folder + "/" + req.files[file].name;
				console.log("Moving: " + req.files[file].path + " =>>>>> " + newPath);
				fs.writeFile(newPath, data, function (err) {
					if (err) console.log("Error Uploading file");
					var filename = req.files[file].name;
					generateImage(folder, filename, function (result) {
						if (result.success) {
							res.json(result);
						} else {
							console.log("Error");
						}
					});
				});
			});
		}
	} else {
		res.json({error: "Folder is undefined"});
	}
};
