/*jslint node: true, laxcomma: true */

//DOM Related Crap

var hash = require('./namehash.js');
require('docMagic');


$ ( function () {
	require('./admin') ();
	require('./folder') ();
	require('./adminAlbum') ();
	require('./folder') ();
	require('./folderUpload') ();

});