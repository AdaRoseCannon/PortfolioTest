var hash = require('./namehash.js');
require('docMagic');
$ ( function () {
	$(".generateLink").bind('click',function(e) {
		var url = e.currentTarget.dataset.value;
		$.get(url, function(data) {
			if (data.success) {
				$(e.currentTarget).find('img')[0].src = "data:image/jpg;base64,"+data.success;
			}
		}, "json");
	});
});
console.log("started");