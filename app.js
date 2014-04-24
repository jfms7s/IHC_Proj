
/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');
var path = require('path');
var orm = require('orm');

var app = express();

//define Models
app.use(orm.express("postgres://postgres:postgres@127.0.0.1:5432/ReBook", {
    define: require('./models').DefineSchema
}));

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon(__dirname + '/public/favicon.ico'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(app.router);
app.use(require('less-middleware')({ src: path.join(__dirname, 'public') }));
app.use(express.static(path.join(__dirname, 'public')));

//Define application Vars
app.locals({
    AppVars: {
        Title: 'ReBook'
    }
});

// development only
if ('development' == app.get('env')) {
    app.use(express.logger('dev'));
    app.use(express.errorHandler());
}

//Routes control
require('./routes')(app);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
