
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
	var inputFile = __dirname + "/../data/raw/" + folder + "/" + file;
	var target = __dirname + "/../data/thumbs/" + folder + "/" + file;
	var targetFolder = __dirname + "/../data/thumbs/" + folder;

	if (!fs.existsSync(targetFolder)){
		fs.mkdirSync(targetFolder);
	}

	gd.openJpg(inputFile,
		function(Jpg, path) {
		    if(Jpg) {
		        var w = Math.floor(Jpg.width/2), h = Math.floor(Jpg.height/2);
		        var target_Jpg = gd.createTrueColor(w, h);

		        Jpg.copyResampled(target_Jpg,0,0,0,0,w,h,Jpg.width,Jpg.height);
		        target_Jpg.saveJpg(target, 1, gd.noop);
		    }
		}
	);

	res.json({text: "Hello World"});
};
