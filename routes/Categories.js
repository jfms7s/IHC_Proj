module.exports = function(app, prefix){
    app.post(prefix+'/get', function(req, res){
        req.models.Category.all(function(err,result){
            res.send(result);
        });
    });
}