module.exports = function () {
	$(".openFolder").bind('click',function (e) {
		$.get("/admin", {folder: $(e.currentTarget).data("folder")}, function(data) {
			var string = "";
			for(file in data.files){
				string += "\n" + '<a href="#" onclick="return false" class="list-group-item openFolder">' + (data.files[file].thumbExists ? '<img class="inline-thumb" src="' + data.files[file].thumb + '" /> ':"") +  data.files[file].name + '</a>';
			}
			document.getElementById('folder-contents').innerHTML = string;
		}, "json");
	});
};