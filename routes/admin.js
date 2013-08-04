
var fs = require('fs');
var url = require('url');
module.exports = function(req, res){

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
	if (req.headers.accept && req.headers.accept.indexOf("application/json")!== -1) {
		res.json(renderVars);
		return;
	}
	res.render('admin', renderVars);
};