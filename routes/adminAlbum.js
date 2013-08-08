

var fs = require('fs');
var urlparse = require('url').parse;

module.exports = function(req, res, callback){

	var dataPath = fs.realpathSync(__dirname + "/../data/");
	var targetFolder = dataPath + "/thumbs/";
	var dataFile = targetFolder + "/" + "index.json";
	var renderVars = {
		title: 'Portfolio Site',
		subtitle: 'Admin Page - Album Sort',
		url: urlparse(req.url).pathname,
		album: {}
	};
	var ls;

	ls = fs.readdirSync(__dirname + "/../data/raw/");
	for (var i in ls) {
		var t = fs.statSync(__dirname + "/../data/raw/" + ls[i]);
		ls[i] = {name: ls[i], isFile: t.isFile(), isDirectory: t.isDirectory()};
	}
	renderVars.files = ls;

	ls = fs.readdirSync(__dirname + "/../data/album/");
	for (var i in ls) {
		var url = __dirname + "/../data/album/" + ls[i];
		var data = require(url);
		renderVars.album[data.fileName] = data;
	}

	renderVars.jade = 'adminAlbum';
	callback(renderVars);
};