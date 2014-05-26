module.exports = function(app, prefix){
    app.get(prefix+'/GetAll', function(req, res){
        req.models.Comment.all(function(err,result){
            res.send(result);
        });
    });

    //GET ALL
    app.get(prefix+'/', function(req, res){
        req.models.Comment.all(function(err,result){
            res.send(result);
        });
    });

    //GET
    app.get(prefix+'/:id', function(req, res){
        req.models.Comment.get(req.params.id,function(err,Comment){
            var comment = Comment;
            res.send(comment);

        });
    });

    //CREATE
    app.post(prefix+'/', function(req, res){

        var Comment = {
            Description     : req.body.Description,
            Content         : req.body.Content,
            StartPos        : req.body.StartPos,
            EndPos          : req.body.EndPos,
            Rate            : -1
        };

        req.models.Comment.create([Comment],function(err,objs){
            req.models.User.get(req.session.User.id,function(err,User){
                var creator = User;
                req.models.Book.get(parseInt(req.body.BookId),function(err, Book){
                    var book = Book;
                    objs[0].setOwner(creator,function(){
                            objs[0].setBook(book,function(){res.redirect('/');});
                    });
                });
            });
        });
    });

    //UPDATE
    app.put(prefix+'/', function(req, res){

        req.models.Translation.get(req.body.id,function(err,Translation) {

            var translation = Translation;

            if (req.body.Content != translation.Content && req.body.Content != '') {
                translation.Content = req.body.Content;
            }

            translation.save(function(err,objs){
                res.redirect('/');
            });

        });
    });

    //REMOVE
    app.delete(prefix+'/:id', function(req, res){
        req.models.Translation.get(req.params.id,function(err,Translation){
            //TODO remover comentarios e traduçoes
            Translation.remove(function(){
                res.redirect('/');
            });
        });
    });

}