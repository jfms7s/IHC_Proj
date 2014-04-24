module.exports = function(app, prefix){
    app.get('/(books)?', function(req, res){
        res.render('Books/index');
    });

    app.get(prefix+'/create', function(req, res){
        res.render('Books/Create');
    });

    app.get(prefix+'/edit', function(req, res){
        res.render('Books/edit');
    });

    app.post(prefix+'/get', function(req, res){
        req.models.Book.all(function(err,result){
            res.send(result);
        });
    });
}
