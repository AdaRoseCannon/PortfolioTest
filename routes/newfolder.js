var fs = require('fs');

module.exports = function(req, res){

	var folder;
	if (req.query.folder) folder = req.query.folder;
		else  folder = req.body.folder;
	var rawPath = fs.realpathSync(__dirname + "/../data/raw/");
	targetFolder = rawPath + "/" + folder + "/";
	if (!fs.existsSync(targetFolder)){
		console.log ("Creating folder " + folder + " in: " + targetFolder);
		fs.mkdir(targetFolder, function () {
			res.json({success: folder});
		});
	} else {
		console.log(targetFolder + " exists already!")
		res.json({failure: "folder exists"});
	}
};