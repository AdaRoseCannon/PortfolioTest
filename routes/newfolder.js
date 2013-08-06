var fs = require('fs');

module.exports = function(req, res, callback){

	var folder;
	if (req.query.folder) folder = req.query.folder;
		else  folder = req.body.folder;
	var rawPath = fs.realpathSync(__dirname + "/../data/raw/");
	targetFolder = rawPath + "/" + folder + "/";
	if (!fs.existsSync(targetFolder)){
		console.log ("Creating folder " + folder + " in: " + targetFolder);
		fs.mkdir(targetFolder, function () {
			callback({success: folder});
		});
	} else {
		console.log(targetFolder + " exists already!")
		callback({err: "folder exists"});
	}
};