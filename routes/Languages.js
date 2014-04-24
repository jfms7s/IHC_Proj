module.exports = function(app, prefix){
    app.post(prefix+'/get', function(req, res){
        req.models.Language.all(function(err,result){
            res.send(result);
        });
    });
}