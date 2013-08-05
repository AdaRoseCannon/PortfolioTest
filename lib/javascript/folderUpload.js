module.exports = function () {
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
$(e.currentTarget).data("folder")
			xhr.onreadystatechange=function(){
				if (xhr.readyState==4 && xhr.status==200) {
					progress.style.display = "none";
					var tmp = $("<div class='file'><div>.IMG</div><img src='" + JSON.parse(xhr.responseText).success + "'' /></div>");
					$('.upload-files').append(tmp.get(0));
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
 	if (dropbox) {
		// init event handlers
		dropbox.addEventListener("dragenter", dragEnter, false);
		dropbox.addEventListener("dragexit", dragExit, false);
		dropbox.addEventListener("dragover", dragOver, false);
		dropbox.addEventListener("drop", drop, false);


		$(".selectFolder").bind('click',function(e) {
			$(".selectFolder").removeClass( "active" )
			$(e.currentTarget).addClass("active");
			$(dropbox).data("folder", $(e.currentTarget).data("folder"));
		});
	}
};