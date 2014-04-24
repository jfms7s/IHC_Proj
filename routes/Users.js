module.exports = function(app, prefix){
    app.get(prefix+'/get', function(req, res){
        res.render('Users/get');
    });
    app.post(prefix+'/get', function(req, res){
        res.redirect('Books/');
    });

}