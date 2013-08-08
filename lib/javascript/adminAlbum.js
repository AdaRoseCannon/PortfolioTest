/* jshint node:true */
/* globals $ */

module.exports = function () {
	'use strict';
	$(".openFolder").bind('click', function (e) {
		$.get("/admin", {folder: $(e.currentTarget).data("folder")}, function (data) {
			var string = "";
			for (var file in data.files) {
				string += "\n" + '<a href="#" onclick="return false" class="list-group-item openFolder">' + (data.files[file].thumbExists ? '<img class="inline-thumb" src="' + data.files[file].thumb + '" /> ':"") +  data.files[file].name + '</a>';
			}
			document.getElementById('folder-contents').innerHTML = string;
		}, "json");
	});

	$(".new-album").bind('click', function (e) {
		var name = $(e.currentTarget.parentNode.parentNode).find('#newalbumname').get(0).value;
		var albumValue = {album: name.replace(/([^\w\d\.\-_~,;:\[\]\(\]]|[\.]{2,})/gi, '').toLowerCase()};
		var url = "/newalbum";
		albumValue.data = {name: name, text: "HelloWord", fileName: albumValue.album};
		if (albumValue.album === "") return;
		$.get(url, albumValue, function (data) {
			if (data.success) {
				document.getParentByClassList(e.currentTarget, "list-group-item", function (result) {
					$(result).after($('<a href="#" onclick="return false" data-folder="' + data.success + '" class="list-group-item selectAlbum"><label class="glyphicon glyphicon-folder-close"> ' + data.success + '</label></a>').get(0));
				});
			}
		}, "json");
	});
};