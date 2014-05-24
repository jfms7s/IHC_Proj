module.exports.DefineSchema = function (db, models,next) {

    models.User = db.define('User', {
        //id              : { type: 'number'},
        Username        : { type: 'text', size: 100,unique: true ,required:true},
        Name            : { type: 'text', size: 100,unique: false ,required:true},
        Surname         : { type: 'text', size: 100,unique: false ,required:true},
        Password        : { type: 'text', size: 100,required:true},
        Email           : { type: 'text', size: 200,required:true},

        Birthday        : { type: 'date', time: false,required:false},
        Sex             : ['F','M'],
        PhotoLink       : { type: 'text', size: 500,required:false}
    });

    models.Book = db.define('Book', {
        //id              : { type: 'number'},
        Title           : { type: 'text', size: 200,unique: false ,required:true},
        Description     : { type: 'text', size: 500,required:true},
        FileType        : { type: 'text', size: 10 ,required:true},
        DateAdded       : { type: "date", time: true },
        ImgLink         : { type: 'text', size: 300,required:false},
        OriginalAuthor  : { type: 'text', size: 300,required:false},
        FileStoreName   : { type: 'text', size: 200,unique: false ,required:false},
        FileName        : { type: 'text', size: 200,unique: false ,required:false}
    });

    models.Category = db.define('Category', {
        //id              : { type: 'number'},
        Title           : { type: 'text', size: 200,unique: true ,required:true},
        Description     : { type: 'text', size: 500,required:false}
    })

    models.Language = db.define('Language', {
        //id              : { type: 'number'},
        Name            : { type: 'text', size: 200,unique: false ,required: true},
        ImgUrl          : { type: 'text', size: 500,required: false},
        Code            : { type: 'text', size: 100,required: true}
    });

    models.Comment = db.define('Comment', {
        //id              : { type: 'number'},
        Description     : { type: 'text', size: 300,unique: false ,required: true},
        Content         : { type: 'text', size: 500,unique: false ,required: true},
        StartPos        : { type: 'number',unique: false ,required: true},
        EndPos          : { type: 'number',unique: false ,required: true},
        Rate            : { type: 'number',unique: false ,required: true ,defaultValue: 0}
    });

    models.Translation = db.define('Translation', {
        //id              : { type: 'number'},
        Content         : { type: 'text', size: 1000,unique: false ,required:true},
        StartPos        : { type: 'number',unique: false ,required:true},
        EndPos          : { type: 'number',unique: false ,required:true},
        Rate            : { type: 'number',unique: false ,required:true ,defaultValue:0}
    });

    models.User.hasMany('Books' ,models.Book, {},{ reverse: 'Owner'});
    models.User.hasMany('CommentRates' ,models.Comment, {Rating : Number},{ reverse: 'Rater'});
    models.User.hasMany('TranslationRates' ,models.Translation, {Rating : Number},{ reverse: 'Rater'});

    models.Book.hasMany('Categories' ,models.Category, {},{ reverse: 'Books'});
    models.Book.hasOne('Language' ,models.Language,{ reverse: 'Books'});
    models.Book.hasMany('Translations' ,models.Translation,{},{ reverse: 'Book'});
    models.Book.hasMany('Comments' ,models.Comment,{},{ reverse: 'Book'});

    models.Translation.hasMany('Language' ,models.Language);

    db.sync(function (err) {
        if (err) {
            console.log(err.name + ": " + err.message);
        } else {
            console.log("DB Schema Updated !");
            require('./InitBD')(models);
        }

    });

    next();
};

