
/*
 * GET home page.
 */
var fs = require('fs');
var gm   = require('gm');
var sys = require('sys')
var exec = require('child_process').exec;
function puts(error, stdout, stderr) { sys.puts(stdout) }

exports.index = function(req, res){
	res.render('index', { title: 'Portfolio Site' });
};

exports.admin = function(req, res){
	var folder = "";
	if (req.query.folder) folder = req.query.folder;

	var rootPath = fs.realpathSync(__dirname + "/../data/");
	var targetFolder = rootPath + "/thumbs/" + folder.toLowerCase();
	var dataFile = targetFolder + "/" + "index.json";

	var currentData = {};
	if (fs.existsSync(dataFile)){
		currentData = require(dataFile);
	}

	var renderVars = {
		title: 'Portfolio Site',
		subtitle: 'Admin Page',
		folder: folder
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
	var rootPath = fs.realpathSync(__dirname + "/../data/");
	var targetFolder = rootPath + "/thumbs/";
	var dataFile = targetFolder + "/" + "index.json";
	var renderVars = {
		title: 'Portfolio Site',
		subtitle: 'Admin Page'
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
	var rootPath = fs.realpathSync(__dirname + "/../data/");
	var targetFolder = rootPath + "/thumbs/";
	var dataFile = targetFolder + "/" + "index.json";
	var renderVars = {
		title: 'Portfolio Site',
		subtitle: 'Admin Page'
	};
	var ls = fs.readdirSync(__dirname + "/../data/raw/");
	for (var i in ls) {
		var t = fs.statSync(__dirname + "/../data/raw/" + ls[i]);
		ls[i] = {name: ls[i], isFile: t.isFile(), isDirectory: t.isDirectory()};
	}
	renderVars.files = ls;
	res.render('adminAlbum', renderVars);
};

exports.generate = function(req, res){
	var folder = req.query.folder.toLowerCase();
	var file = req.query.file;
	var rootPath = fs.realpathSync(__dirname + "/../data/");
	var options = require (rootPath + "/options.json");
	var targetFolder = rootPath + "/thumbs/" + folder;
	var inputFile = rootPath + "/raw/" + folder + "/" + file;
	var dataFile = targetFolder + "/" + "index.json";
	var target = targetFolder + "/" + file.toLowerCase();
	var largeName = target.replace(/(\.[\w\d_-]+)$/i, '_large$1');
	var watermark = rootPath + "/watermark.png";
	var imagesToGen = 2;

	function writeFiles() {
		imagesToGen--;
		if(imagesToGen === 0){
			fs.writeFile(dataFile, JSON.stringify(currentData, null, "\t"), function(err) {
				if(err) {
					console.log("Could not save JSON: " + dataFile);
					console.log(err);
				}
			});
		}
	}

	if (!fs.existsSync(targetFolder)){
		fs.mkdirSync(targetFolder);
	}

	if (!fs.existsSync(targetFolder)){
		res.json({failure: "Invalid folder layout"});
		throw new Error ("Invalid folder layout");
		return;
	}

	if (!fs.existsSync(inputFile)){
		res.json({failure: "No input file!!!!"});
		return;
	}


	var currentData = {};
	if (fs.existsSync(dataFile)){
		currentData = require(dataFile);
	}

	currentData[file.toLowerCase()]={};

	gm(inputFile).autoOrient()
	.resize(1536,1152)
	.noProfile()
	.size(function (err, size) {

		this.fill("rgba(255,255,255,0.5)", 1)
		.compose("Plus")
		.drawLine(0, 0, size.width, size.height)
		.drawLine(0, size.height, size.width, 0)
		.fontSize(56)
		.quality(options.quality)
		//.drawText(20, 30, "GMagick!", "Center")
		.write(largeName, function (err) {
			if (!err) {
				exec("composite -dissolve 40% -gravity center " + watermark + "  " + largeName + "  " + largeName, function (error, stdout, stderr) {
					fs.readFile(target, function(err, original_data){
						var data = original_data.toString('base64');
					    currentData[file.toLowerCase()].large=data;
					    sys.puts(stdout);
						console.log('done: '+ largeName);
						writeFiles();
					});
				});
			} else {
				console.log({failure: err, vars: {inputFile: inputFile, target: target}});
			}
		});
	});		

	gm(inputFile).autoOrient()
	.noProfile()
	.resize(240,240)
	.write(target, function (err) {
		if (!err) {
			console.log('done: '+ inputFile);
			fs.readFile(target, function(err, original_data){
				var data = original_data.toString('base64');
			    currentData[file.toLowerCase()].thumb=data;
				writeFiles();
			    res.json({success: data});
			});
		} else {
			console.log({failure: err, vars: {inputFile: inputFile, target: target}});
		}
	});
};
