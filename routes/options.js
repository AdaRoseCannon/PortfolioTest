
var fs = require('fs');
var url = require('url');
module.exports = function(req, res){
	var dataPath = fs.realpathSync(__dirname + "/../data/");
	var renderVars = {
		title: 'Portfolio Site',
		subtitle: 'Admin Page - Options',
		url: url.parse(req.url).pathname,
		options: require (dataPath + "/options.json")
	};
	if (req.headers.accept && req.headers.accept.indexOf("application/json")!== -1) {
		res.json(renderVars);
		return;
	}
	res.render('options', renderVars);
};