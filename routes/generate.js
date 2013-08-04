
var generateImage = require('./generateImage');
module.exports = function(req, res){
	var folder = req.query.folder.toLowerCase();
	var file = req.query.file;
	generateImage (folder, file, function (result) {
		if (result.success) {
			res.json(result);
		} else {
			console.log("Error");
		}
	});
};