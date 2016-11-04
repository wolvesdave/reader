
var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var stormpath = require('express-stormpath');
var db = require('./config/db');
var security = require('./config/security');
var routes = require('./app/routes');
var app = express();
var morgan = require('morgan');

/* export STORMPATH_CLIENT_APIKEY_ID=1GTP266RYID4QBWVN9HL07VD6
export STORMPATH_CLIENT_APIKEY_SECRET=sNzyD5+GmyWkH4UMJSyzASYVZ7QLqoOLb3Vmj1W5YdE
export STORMPATH_APPLICATION_HREF=https://api.stormpath.com/v1/applications/3kMK5hMEcrWa2h09OXY8EX */

console.log('about to connect to Stormpath with ./config/stormpath_apikey.properties');

app.use(morgan);

app.use(stormpath.init(app, {
     apiKeyFile: './config/stormpath_apikey.properties',
     application: 'https://api.stormpath.com/v1/applications/3kMK5hMEcrWa2h09OXY8EX',
     secretKey: security.stormpath_secret_key
 }));

var port = 8000;

console.log('about to connect to ' + db.url);

mongoose.connect(db.url);

app.use(bodyParser.urlencoded({ extended: true }));

routes.addAPIRouter(app, mongoose, stormpath);

app.use(function(req, res, next){
   res.status(404);
   res.json({ error: 'Invalid URL' });
});

app.listen(port);

console.log('Magic happens on port ' + port);

exports = module.exports = app;
