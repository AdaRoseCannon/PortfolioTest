
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , fs = require('fs')
  , browserify_express = require('browserify-express')
  , stylus = require('stylus')
  , nib = require('nib')
  , url = require('url');

var app = express();

var bundle = browserify_express({
    entry: __dirname + '/lib/javascript/index.js',
    watch: __dirname + '/lib/javascript/',
    mount: '/js/_javascript.js',
    verbose: true,
    minify: false,
    bundle_opts: { debug: true } // enable inline sourcemap on js files 
});

function compile(str, path) {
  return stylus(str)
    .set('filename', path)
    .set('compress', true)
    .use(nib());
}

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.compress());
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(express.static(__dirname, '/public'), { maxAge: 31557600000 });
app.use(stylus.middleware({src: __dirname + "/public", compile: compile}), { maxAge: 31557600000 });
app.use(bundle);
app.use(app.router);


var optionsPath = __dirname + "/data/options.json";
var optionsBackupPath = __dirname + "/lib/javascript/options.json";
if (!fs.existsSync(optionsPath)) {
  fs.createReadStream(optionsBackupPath).pipe(fs.createWriteStream(optionsPath));
} else {
  var optionsTemplate = require(optionsBackupPath);
  var options = require(optionsPath);
  // Check everything in the template is present in the users option file.
  for (property in optionsTemplate) {
    if (!options.hasOwnProperty(property)) {
      options[property] = optionsTemplate[property];
    }
  }

  // Remove obsolete properties
  for (property in options) {
    if (!optionsTemplate.hasOwnProperty(property)) {
      options[property] = undefined;
    }
  }

  //write to file
  fs.writeFile(optionsPath, JSON.stringify(options, null, "\t"), function(err) {
    if(err) {
      console.log("Could not save JSON: " + optionsPath);
      console.log(err);
    }
  });
}

app.get('/', routes.index);

app.get('/users', user.list);

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
  app.post('/upload', routes.upload);
}

app.get('*', function (req,res) {

  // development only
  if ('development' == app.get('env')) {
    var docRequested = (url.parse(req.url).pathname).substring(1);
    if (routes[docRequested] !== undefined) {
      (routes[docRequested])(req,res);
      return;
    }
  }


  var publicURL = __dirname + '/public/' + req.url;
  if (fs.existsSync(publicURL)) {
    res.setHeader("Cache-Control", "max-age=31556926");
    res.sendfile(publicURL);
  } else {
    res.status(404);

    // respond with html page
    if (req.accepts('html')) {
      res.render('404', { url: req.url });
      return;
    }

    // respond with json
    if (req.accepts('json')) {
      res.send({ error: 'Not found' });
      return;
    }

    // default to plain-text. send()
    res.type('txt').send('Not found');
  }
});


http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});