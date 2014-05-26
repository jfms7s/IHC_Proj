fs = require('fs')

module.exports = function(app, prefix){
    app.get('/(books)?', function(req, res){
        res.locals.crudResult=[{type:3,result:"Username ou Password incorrectos"}];
        res.render('Books/index',{UserData: req.session.User});
    });

    //CREATE BOOK
    app.get(prefix+'/create', function(req, res){
        req.models.Language.all(function(err,result){
            res.render('Books/Create',{Language:result});
        });
    });
    app.post(prefix+'/create', function(req, res){

        var Book = {
            Title           : req.body.Title,
            Description     : req.body.Description,
            FileType        : req.files.File.extension,
            DateAdded       : new Date(),
            FileStoreName   : req.files.File.originalname,
            FileName        : req.files.File.name
        }

        if(req.body.Author!=null && req.body.Author != ''){
            Book.OriginalAuthor = req.body.Author;
        }
        if(req.body.UrlCover!=null && req.body.UrlCover != ''){
            Book.ImgLink = req.body.UrlCover;
        }

        req.models.Book.create([Book],
            function(err,objs){
                req.models.User.get(req.session.User.id,function(err,User){
                    var creator = User;
                    req.models.Language.get(parseInt(req.body.Language),function(err, Language){
                        var lang = Language;
                        objs[0].addOwner(creator);
                        objs[0].setLanguage(lang,function(){
                            res.redirect('/');
                        });

                    });
                });

            });
    });

    //EDIT
    app.get(prefix+'/edit/:id', function(req, res){
        req.models.Book.get(req.params.id,function(err,Book){

            req.models.Language.all(function(err,result){
                var book = Book;
                res.render('Books/edit',{Book:book,Language:result});
            });
        });
    });
    //EDIT BOOK
    app.post(prefix+'/edit', function(req, res){
        req.models.Book.get(req.body.id,function(err,Book){

            var TempBook = Book;

            if(req.body.Title!=Book.Title && req.body.Title != ''){
                TempBook.Title = req.body.Title;
            }
            if(req.body.Description!=Book.Description && req.body.Description != ''){
                TempBook.Description = req.body.Description;
            }
            if(req.body.Author!=Book.OriginalAuthor && req.body.Author != ''){
                TempBook.OriginalAuthor = req.body.Author;
            }
            if(req.body.UrlCover!=Book.ImgLink && req.body.UrlCover != ''){
                TempBook.ImgLink = req.body.UrlCover;
            }

            req.models.Language.get(parseInt(req.body.Language),function(err, Language){
                var lang = Language;
                TempBook.setLanguage(lang,function(){
                    TempBook.save(function(err,objs){
                        res.redirect('/');
                    });
                });
            });
        });
    });


    //GET USER BOOKS
    app.get(prefix+'/GetUserBooks', function(req, res){
        req.models.User.get(req.session.User.id,function(err,User){
            User.getBooks(function(err,Books){
                res.render('Books/UserBooks',{Books:Books});
            });
        });
    });

    //GET BOOK
    app.get(prefix+'/get/', function(req, res){

        req.models.Book.get(req.query.id,function(err,Book){
            if (err) {
                return console.log(err);
            }

            fs.readFile(app.locals.AppVars.UploadFolder+Book.FileName, 'utf8', function (err,data) {
                if (err) {
                    return console.log(err);
                }
                console.log(data);
                res.render('Books/Get',{
                    UserData: req.session.User,
                    RightPage: data,
                    LeftPage: data,
                    BookInfor: Book
                });

            });

        });

    });

    app.post(prefix+'/get', function(req, res){


        var id = req.body.id;
        var startPos = parseInt(req.body.StartPos);
        var padding = parseInt(req.body.Padding);

        console.log(id);

        req.models.Book.get(req.body.id,function(err,Book){
            if (err) {
                return console.log(err);
            }

            fs.readFile(app.locals.AppVars.UploadFolder+Book.FileName, 'utf8', function (err,data) {
                if (err) {
                    return console.log(err);
                }
                res.send([{Content:data.substring(startPos,startPos+padding),StartPos:startPos,EndPos:startPos+padding},{Content:data.substring(startPos+padding,startPos+padding*2),StartPos:startPos+padding,EndPos:startPos+padding*2}]);

            });


        });

    });


    //GET BOOKAll
    app.post(prefix+'/GetAll', function(req, res){

        var cat = new Array();
        var lang = new Array();

        if(req.body.Category != null && req.body.Category.length>0){

            req.body.Category.forEach(function(elemet){cat[cat.length]= parseInt(elemet.id);});
        }

        if(req.body.Language != null && req.body.Language.length>0){
            req.body.Language.forEach(function(elemet){lang[cat.length]= parseInt(elemet.id);});
        }

        if((req.body.Filter!=null && req.body.Filter!='')||(cat.length>0)||(lang.length>0)){
            req.models.Book.all().each().filter(function(result){
                var ret = true;
                if(req.body.Filter!=null && req.body.Filter!=''){
                    ret = ret && (result.Title.toLowerCase().indexOf(req.body.Filter.toLowerCase()) > -1);
                }
                if(lang.length>0){
                    ret = ret && (lang.indexOf(result.language_id)>-1);
                }
                return ret;
            }).
            get(function(result) {
                res.send(result);
            });

        }

        req.models.Book.all(function(err,result){
            res.send(result);
        });
    });

    //removes
    app.get(prefix+'/remove/:id', function(req, res){
        req.models.Book.get(req.params.id,function(err,Book){
            //TODO remover comentarios e traduçoes
            Book.remove(function(){
                res.redirect('/');
            });
        });
    });
}
