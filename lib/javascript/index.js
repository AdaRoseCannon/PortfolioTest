var hash = require('./namehash.js');
require('docMagic');
$ ( function () {
	$(".generateLink").bind('click',function(e) {
		var url = e.currentTarget.dataset.value;
		$.get(url, function(data) {
			if (data.success) {
				var img = document.createElement('img');
				img.src = "data:image/jpg;base64,"+data.success;
				$('body').append( img );
			}
		}, "json");
	});
});
console.log("started");