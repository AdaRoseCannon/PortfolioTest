/*jslint node: true, laxcomma: true */

//DOM Related Crap

var hash = require('./namehash.js');
require('docMagic');
require('jquery-browserify');

require('./admin') ();
require('./folder') ();
require('./adminAlbum') ();
require('./folder') ();
require('./folderUpload') ();