
var fs = require('fs');
var url = require('url');
module.exports = function(req, res, callback){
	var dataPath = fs.realpathSync(__dirname + "/../data/");
	var renderVars = {
		title: 'Portfolio Site',
		subtitle: 'Admin Page - Options',
		url: url.parse(req.url).pathname,
		options: require (dataPath + "/options.json")
	};
	renderVars.jade = 'options';
	callback(renderVars);
};