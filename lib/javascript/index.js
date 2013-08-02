/*jslint node: true, laxcomma: true */

var hash = require('./namehash.js');
require('docMagic');
$ ( function () {
	$(".generateLink").bind('click',function(e) {
		var url = e.currentTarget.dataset.value;
		$.get(url, function(data) {
			if (data.success) {
				$(e.currentTarget).find('img')[0].src = data.success;
			}
		}, "json");
	});

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

	$(".selectFolder").bind('click',function(e) {
		$(".selectFolder").removeClass( "active" )
		$(e.currentTarget).addClass("active");
		$(".upload-files").data("folder", $(e.currentTarget).data("folder"));
	});

	(function () {

		function readfiles(files,folder) {
		    var progress = document.querySelector('.upload-files>h3');

			if (folder===undefined) {
				progress.innerHTML = "Select a folder before uploading.";
				return;
			}
			var tests = {
				filereader: typeof FileReader != 'undefined',
				dnd: 'draggable' in document.createElement('span'),
				formdata: !!window.FormData,
				progress: "upload" in new XMLHttpRequest
			}


			var formData = tests.formdata ? new FormData() : null;
			for (var i = 0; i < files.length; i++) {
				if (tests.formdata) formData.append('file', files[i]);
			}
			if (tests.formdata) formData.append('folder', folder);

			// now post a new XHR request
			if (tests.formdata) {
				var xhr = new XMLHttpRequest();
				xhr.open('POST', '/upload');
				xhr.onload = function() {
					progress.value = progress.innerHTML = 100;
				};

				if (tests.progress) {
					xhr.upload.onprogress = function (event) {
						if (event.lengthComputable) {
							var complete = (event.loaded / event.total * 100 | 0);
							progress.value = progress.innerHTML = complete;
						}
					}
				}

				xhr.onreadystatechange=function(){
					if (xhr.readyState==4 && xhr.status==200) {
						progress.style.display = "none";
						document.querySelector('.upload-files').innerHTML += "<div class='file'><div>.IMG</div><img src='" + JSON.parse(xhr.responseText).success + "'' /></div>";
					}
				}

				xhr.send(formData);
			}
		}

		function noopHandler(evt) {
			evt.stopPropagation();
			evt.preventDefault();
		}

		function dragEnter(evt) {
			noopHandler(evt);
		}

		function dragExit(evt) {
			noopHandler(evt);
		}

		function dragOver(evt) {
			noopHandler(evt);
		}

		function drop(evt) {
			evt.stopPropagation();
			evt.preventDefault();
    		readfiles(evt.dataTransfer.files, $(evt.currentTarget).data("folder"));
		}

		var dropbox = document.querySelector('.upload-files');
	 
		// init event handlers
		dropbox.addEventListener("dragenter", dragEnter, false);
		dropbox.addEventListener("dragexit", dragExit, false);
		dropbox.addEventListener("dragover", dragOver, false);
		dropbox.addEventListener("drop", drop, false);
	})()
});