var fs = require('fs');

module.exports = function(req, res, callback){
	var album;
	if (req.query.album) album = req.query.album;
		else  album = req.body.album;
	if (req.query.data) currentData = req.query.data
		else currentData = req.body.data;

	var newName = album.replace(/([^\w\d\.\-_~,;:\[\]\(\]]|[\.]{2,})/gi, '').toLowerCase();

	var albumPath = fs.realpathSync(__dirname + "/../data") + "/album/";
	targetalbum = albumPath + "/" + newName + ".json";

	if (!fs.existsSync(albumPath)) {
		fs.mkdirSync(albumPath)
	}
	//Create album
	fs.writeFile(targetalbum, JSON.stringify(currentData, null, "\t"), function(err) {
		if(err) {
			console.log("Could not save JSON: " + dataFile);
			console.log(err);
		} else {
			callback({success: newName});
		}
	});
};