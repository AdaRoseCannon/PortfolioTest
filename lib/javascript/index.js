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

	(function () {

		function readfiles(files,folder) {
			var tests = {
				filereader: typeof FileReader != 'undefined',
				dnd: 'draggable' in document.createElement('span'),
				formdata: !!window.FormData,
				progress: "upload" in new XMLHttpRequest
			}

		    var progress = document.querySelector('.upload-files>h3');

			var formData = tests.formdata ? new FormData() : null;
			for (var i = 0; i < files.length; i++) {
				if (tests.formdata) formData.append('file', files[i]);
			}

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
						console.log(JSON.parse(xhr.responseText));
					}
				}

				xhr.send(formData+'&folder='+folder);
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
    		readfiles(evt.dataTransfer.files,'group1');
		}

		var dropbox = document.querySelector('.upload-files');
	 
		// init event handlers
		dropbox.addEventListener("dragenter", dragEnter, false);
		dropbox.addEventListener("dragexit", dragExit, false);
		dropbox.addEventListener("dragover", dragOver, false);
		dropbox.addEventListener("drop", drop, false);
	})()
});