/* jshint node:true */
/* globals $ */

//DOM Related Crap

var hash = require('./namehash.js');
require('docMagic');


$(function () {
	'use strict';
	require('./admin') ();
	require('./folder') ();
	require('./adminAlbum') ();
	require('./folder') ();
	require('./folderUpload') ();

});