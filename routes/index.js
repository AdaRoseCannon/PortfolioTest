
/*
 * GET home page.
 */
var fs = require('fs');
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

	gd.openJpeg(inputFile,
		function(Jpeg, path) {
		    if(Jpeg) {
		        var w = Math.floor(Jpeg.width/2), h = Math.floor(Jpeg.height/2);
		        var target_Jpeg = gd.createTrueColor(w, h);

		        Jpeg.copyResampled(target_Jpeg,0,0,0,0,w,h,Jpeg.width,Jpeg.height);
		        target_Jpeg.saveJpeg(target, 80);
		    }
		}
	);

	res.json({text: "Hello World"});
};
