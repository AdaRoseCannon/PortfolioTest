
var fs = require('fs');
var url = require('url');

module.exports = function(req, res, callback){
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
	renderVars.jade = 'adminAlbum';
	callback(renderVars);
};