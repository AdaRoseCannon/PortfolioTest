
var generateImage = require('./generateImage');
module.exports = function(req, res, callback){
	var folder = req.query.folder.toLowerCase();
	var file = req.query.file;
	generateImage (folder, file, function (result) {
		if (result.success) {
			callback (result);
		} else {
			console.log("Error");
		}
	});
};