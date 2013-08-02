JSON.flatStringify = function (object) {
	var output = '';
	for (var property in object) {
		if (true) {
			output += property;
			if (object[property] && object[property].toString) {
				if (object[property].toString() === "[object Object]") {
					try {
						output += ": " + JSON.stringify(object[property]);
					}
					catch (e) {
						output += ": " + object[property].toString() + " could not stringify";
					}
				} else {
					output += ": " + object[property].toString();
				}
			}
			output += "\n";
		}
	}
	return output;
};

/*
 * GET home page.
 */
var fs = require('fs');
var url = require('url');
var generateImage = require('./generateImage');


exports.index = function(req, res){
	res.setHeader("Cache-Control", "max-age=31556926");
	res.render('index', { title: 'Portfolio Site' });
};

exports.upload = function (req, res) {
	var rawPath = fs.realpathSync(__dirname + "/../data/raw/");


	if (req.body.folder) {
		var folder = req.body.folder;

		for (file in req.files) {
			fs.readFile(req.files[file].path, function (err, data) {
				var newPath = rawPath + "/" + folder + "/" + req.files[file].name;
				console.log ("Moving: " + req.files[file].path + " =>>>>> " + newPath);
				fs.writeFile(newPath, data, function (err) {
					if (err) console.log("Error Uploading file");
					var filename = req.files[file].name;
					generateImage (folder, filename, function (result) {
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

exports.admin = function(req, res){
	var folder = "";
	if (req.query.folder) folder = req.query.folder;

	var dataPath = fs.realpathSync(__dirname + "/../data/");
	var targetFolder = dataPath + "/thumbs/" + folder.toLowerCase();
	var dataFile = targetFolder + "/" + "index.json";

	var currentData = {};
	if (fs.existsSync(dataFile)){
		currentData = require(dataFile);
	}

	var renderVars = {
		title: 'Portfolio Site',
		subtitle: 'Admin Page',
		folder: folder,
		url: url.parse(req.url).pathname
	};
	var ls = fs.readdirSync(__dirname + "/../data/raw/" + folder + "/");
	for (var i in ls) {
		var t = fs.statSync(__dirname + "/../data/raw/" + folder + "/" + ls[i]);
		ls[i] = {name: ls[i], isFile: t.isFile(), isDirectory: t.isDirectory()};
		ls[i].thumbExists = currentData[ls[i].name.toLowerCase()] !== undefined;
		if (ls[i].thumbExists) {
			ls[i].thumb = currentData[ls[i].name.toLowerCase()].thumb;
		}
	}
	renderVars.files = ls;
	res.render('admin', renderVars);
};

exports.folder = function(req, res){
	var dataPath = fs.realpathSync(__dirname + "/../data/");
	var targetFolder = dataPath + "/thumbs/";
	var dataFile = targetFolder + "/" + "index.json";
	var renderVars = {
		title: 'Portfolio Site',
		subtitle: 'Admin Page - Folder Manage',
		url: url.parse(req.url).pathname
	};
	var ls = fs.readdirSync(__dirname + "/../data/raw/");
	for (var i in ls) {
		var t = fs.statSync(__dirname + "/../data/raw/" + ls[i]);
		ls[i] = {name: ls[i], isFile: t.isFile(), isDirectory: t.isDirectory()};
	}
	renderVars.files = ls;
	res.render('folder', renderVars);
};

exports.adminAlbum = function(req, res){
	var dataPath = fs.realpathSync(__dirname + "/../data/");
	var targetFolder = dataPath + "/thumbs/";
	var dataFile = targetFolder + "/" + "index.json";
	var renderVars = {
		title: 'Portfolio Site',
		subtitle: 'Admin Page - Album Sort',
		url: url.parse(req.url).pathname
	};
	var ls = fs.readdirSync(__dirname + "/../data/raw/");
	for (var i in ls) {
		var t = fs.statSync(__dirname + "/../data/raw/" + ls[i]);
		ls[i] = {name: ls[i], isFile: t.isFile(), isDirectory: t.isDirectory()};
	}
	renderVars.files = ls;
	res.render('adminAlbum', renderVars);
};

exports.options =  function(req, res){
	var dataPath = fs.realpathSync(__dirname + "/../data/");
	var renderVars = {
		title: 'Portfolio Site',
		subtitle: 'Admin Page - Options',
		url: url.parse(req.url).pathname,
		options: require (dataPath + "/options.json")
	};
	res.render('options', renderVars);
};

exports.newfolder =  function(req, res){
	if (req.query.folder) folder = req.query.folder;
		else  folder = req.body.folder;
	var rawPath = fs.realpathSync(__dirname + "/../data/raw/");
	targetFolder = rawPath + "/" + folder + "/";
	if (!fs.existsSync(targetFolder)){
		console.log ("Creating folder " + folder + " in: " + targetFolder);
		fs.mkdir(targetFolder, function () {
			res.json({success: folder});
		});
	} else {
		console.log(targetFolder + " exists already!")
		res.json({failure: "folder exists"});
	}
};

exports.generate = function(req, res){
	var folder = req.query.folder.toLowerCase();
	var file = req.query.file;
	generateImage (folder, file, function (result) {
		if (result.success) {
			res.json(result);
		} else {
			console.log("Error");
		}
	});
};
