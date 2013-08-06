module.exports = function(req, res, callback){
	var album;
	if (req.query.album) album = req.query.album;
		else  album = req.body.album;
	var albumPath = fs.realpathSync(__dirname + "/../data/album/");
	targetalbum = albumPath + "/" + albumName + ".js";

	if (!fs.existsSync(albumPath)) {
		fs.mkdir(albumPath, function () {
			//Create album
			fs.writeFile(targetalbum, JSON.stringify(currentData, null, "\t"), function(err) {
				if(err) {
					console.log("Could not save JSON: " + dataFile);
					console.log(err);
				} else {
					callback({success: true});
				}
			});
		});
	}
};