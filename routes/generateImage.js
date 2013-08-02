
function generateImage (folder, file, callback) {
	var sys = require('sys');
	var exec = require('child_process').exec;
	var fs = require('fs');
	var gm   = require('gm');
	function puts(error, stdout, stderr) { sys.puts(stdout) }

	var dataPath = fs.realpathSync(__dirname + "/../data/");
	var options = require (dataPath + "/options.json");
	var targetFolder = dataPath + "/thumbs/" + folder;
	var inputFile = dataPath + "/raw/" + folder + "/" + file;
	var dataFile = targetFolder + "/" + "index.json";
	var target = targetFolder + "/" + file.toLowerCase();
	var largeName = target.replace(/(\.[\w\d_-]+)$/i, '_large$1');
	var watermark = dataPath + "/watermark.png";
	var imagesToGen = 2;

	function writeFiles() {
		imagesToGen--;
		if(imagesToGen === 0){
			fs.writeFile(dataFile, JSON.stringify(currentData, null, "\t"), function(err) {
				if(err) {
					console.log("Could not save JSON: " + dataFile);
					console.log(err);
				}
			});
		}
	}

	if (!fs.existsSync(targetFolder)){
		fs.mkdirSync(targetFolder);
	}

	if (!fs.existsSync(targetFolder)){
		callback ("Invalid folder layout");
		return;
	}

	if (!fs.existsSync(inputFile)){
		callback ({failure: "No input file!!!!"});
		return;
	}


	var currentData = {};
	if (fs.existsSync(dataFile)){
		currentData = require(dataFile);
	}

	currentData[file.toLowerCase()]={};

	gm(inputFile).autoOrient()
	.size(function (err, size1) {
		var newSize = {width: 1536, height: 1152};
		var size = size1;
		if (size1.width>newSize.width || size1.height>newSize.height) {
			var scale;
			if (size1.width/newSize.width > size1.height/newSize.height){
				scale = (newSize.width/size.width);
			} else {
				scale = (newSize.width/size.width);
			}
			size.height*=scale;
			size.width*=scale;
			this.resize(newSize.width, newSize.height);
		}
		console.log (size);
		this.fill("rgba(255,255,255,0.4)", 1)
		.noProfile()
		.drawLine(0, 0, size.width, size.height)
		.drawLine(size.width, 0, 0, size.height)
		.fontSize(56)
		.quality(100)
		.autoOrient()
		.write(largeName, function (err) {
			if (!err) {
				exec("composite -dissolve 40% -gravity center -quality 100 " + watermark + "  " + largeName + "  " + largeName, function (error, stdout, stderr) {
				    sys.puts(stdout);
				    sys.puts(stderr);
					exec("jpegoptim -f -m80 " + largeName, function (error, stdout, stderr) {
					    sys.puts(stdout);
					    sys.puts(stderr);
						fs.readFile(target, function(err, original_data){
							var data = original_data.toString('base64');
						    currentData[file.toLowerCase()].large=data;
							console.log('done: '+ largeName);
							writeFiles();
						});
					});
				});
			} else {
				console.log({failure: err, vars: {inputFile: inputFile, target: target}});
			}
		});
	});		

	gm(inputFile).autoOrient()
	.noProfile()
	.resize(240,240)
	.write(target, function (err) {
		if (!err) {
			console.log('done: '+ inputFile);
			fs.readFile(target, function(err, original_data){
				var data = original_data.toString('base64');
			    currentData[file.toLowerCase()].thumb=data;
				writeFiles();
			    callback({success: data});
			});
		} else {
			console.log({failure: err, vars: {inputFile: inputFile, target: target}});
		}
	});
};

module.exports = generateImage;

