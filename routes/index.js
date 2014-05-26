module.exports = function(app){
    require('./Books')(app, '/Books');
    require('./Categories')(app, '/Categories');
    require('./Languages')(app, '/Languages');
    require('./Users')(app, '/Users');
    require('./Users')(app, '/Users');
    require('./Comments')(app, '/Comments');
    require('./Translations')(app, '/Translations');
}
