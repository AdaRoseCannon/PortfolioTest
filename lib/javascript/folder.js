module.exports = function () {
	$(".new-folder").bind('click',function(e) {
		var folderValue = {folder: $(e.currentTarget.parentNode.parentNode).find('#newfoldername').get(0).value};
		var url = "/newfolder";
		if(folderValue.folder === "") return;
		$.get(url, folderValue, function(data) {
			if (data.success) {
				document.getParentByClassList(e.currentTarget,"list-group-item",function(result) {
					$(result).after($('<a href="#" onclick="return false" data-folder="' + data.success + '" class="list-group-item active selectFolder"><label class="glyphicon glyphicon-folder-close"> ' + data.success + '</label></a>').get(0));
				});
			}
		}, "json");
	});
};