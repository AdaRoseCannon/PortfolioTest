
/*
 * GET home page.
 */
var fs = require('fs');
var browserify = require('browserify');
var gd   = require('node-gd');

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
	folder = req.query.folder;
	file = req.query.file;
	var rootPath = fs.realpathSync(__dirname + "/../data/");
	var targetFolder = rootPath + "/thumbs/" + folder;
	var inputFile = rootPath + "/raw/" + folder + "/" + file;
	var target = targetFolder + "/" + file;

	if (!fs.existsSync(targetFolder)){
		fs.mkdirSync(targetFolder);
	}
	console.log (inputFile);
	var Jpeg = gd.openJpeg(inputFile);
	console.log (Jpeg);
	if(Jpeg) {
		console.log ("Lemonade");

	    var w = Math.floor(Jpeg.width/2), h = Math.floor(Jpeg.height/2);

	    var thumb = gd.createTrueColor(w, h);

	    Jpeg.copyResampled(thumb, 0, 0, 0, 0, w, h, Jpeg.width, Jpeg.height);

	    thumb.saveJpeg(target, 80);

		res.json({file: target, success: fs.existsSync(target)});

	}
};
