
/*
 * GET home page.
 */
var fs = require('fs');
var gm   = require('gm');

exports.index = function(req, res){
	res.render('index', { title: 'Portfolio Site' });
};

exports.admin = function(req, res){
	var folder = "";
	if (req.query.folder) folder = req.query.folder;
	var renderVars = {
		title: 'Portfolio Site',
		subtitle: 'Admin Page',
		folder: folder
	};
	var ls = fs.readdirSync(__dirname + "/../data/raw/" + folder + "/");
	for (var i in ls) {
		var t = fs.statSync(__dirname + "/../data/raw/" + folder + "/" + ls[i]);
		ls[i] = {name: ls[i], isFile: t.isFile(), isDirectory: t.isDirectory()};
		ls[i].thumbExists = false;
	}
	renderVars.files = ls;
	res.render('admin', renderVars);
};

exports.generate = function(req, res){
	var folder, file;
	folder = req.query.folder.toLowerCase();
	file = req.query.file;
	var rootPath = fs.realpathSync(__dirname + "/../data/");
	var targetFolder = rootPath + "/thumbs/" + folder;
	var inputFile = rootPath + "/raw/" + folder + "/" + file;
	var target = targetFolder + "/" + file.toLowerCase();

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

	gm(inputFile)
	.resize(240, 240)
	.noProfile()
	.write(target, function (err) {
		if (!err) {
			console.log('done');
			res.json({success: true});
		} else {
			res.json({failure: err, vars: {inputFile: inputFile, target: target}});
		}
	});
};
