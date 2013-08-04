module.exports = function (object) {
	var output = '';
	for (var property in object) {
		if (true) {
			output += property;
			if (object[property] && object[property].toString) {
				if (object[property].toString() === "[object Object]") {
					try {
						output += ": " + JSON.stringify(object[property]);
					}
					catch (e) {
						output += ": " + object[property].toString() + " could not stringify";
					}
				} else {
					output += ": " + object[property].toString();
				}
			}
			output += "\n";
		}
	}
	return output;
};