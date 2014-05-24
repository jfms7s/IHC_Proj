var passwordHash = require('password-hash');

module.exports = function(app, prefix){

    //LOGIN
    app.get(prefix+'/login', function(req, res){
        res.render('Users/login');
    });
    app.post(prefix+'/login', function(req, res){

        req.models.User.find({ Username: req.body.Username}, function (err,user) {

            if(user.length==0){
                req.crudResult=[{type:3,result:"Username ou Password incorrectos"}];
            }else{
                if(passwordHash.verify(req.body.Password,user[0].Password)){
                    req.session.User = user[0];
                }
                req.crudResult=[{type:1,result:"Usuario logado com sucessos"}];
            }
            res.redirect('/');
        });
    });

    //CREATE USER
    app.get(prefix+'/create', function(req, res){
        res.render('Users/create',
            {User:
                {
                    Username: '',
                    Name: '',
                    Surname: '',
                    Password: '',
                    Email: '',
                    Birthday: '',
                    Sex: -1,
                    PhotoLink: ''
                }
        });
    });
    app.post(prefix+'/create', function(req, res){
        req.models.User.create([{
            Username        : req.body.Username,
            Name            : req.body.Name,
            Surname         : req.body.Surname,
            Password        : passwordHash.generate(req.body.Password),
            Email           : req.body.Email,

            Birthday        : req.body.Bday,
            Sex             : (req.body.Sex=='0'?'M':'F')
        }],
        function(err,objs){
            res.redirect('/');
        });

    });

    //EDIT USER
    app.get(prefix+'/Edit', function(req, res){
        req.models.User.get(req.session.User.id,function(err,User)
        {
            res.render('Users/Edit', {User:User});
        });
    });
    app.post(prefix+'/Edit', function(req, res){
        req.models.User.get(req.session.User.id, function (err, User) {

            console.log(req.body.Username);
            if((User.Username != req.body.Username) && (User.Username != '') ){
                User.Username = req.body.Username;
            }
            if((User.Name != req.body.Name) && (User.Name != '') ){
                User.Name = req.body.Name;
            }
            if((User.Surname != req.body.Surname) && (User.Surname != '') ){
                User.Surname = req.body.Surname;
            }
            if((User.Password != passwordHash.generate(req.body.Password)) && (User.Password != '') ){
                User.Password = passwordHash.generate(req.body.Password);
            }
            if((User.Email != req.body.Email) && (User.Email != '') ){
                User.Email = req.body.Email;
            }
            if((User.Birthday != req.body.Birthday) && (User.Birthday != '') ){
                User.Birthday = req.body.Birthday;
            }
            if((User.Sex != (req.body.Sex=='0'?'M':'F')) && (User.Sex != '') ){
                User.Sex = (req.body.Sex=='0'?'M':'F');
            }

            User.save(function (err) {
                res.redirect('/');
            });
        });
    });

    //LOGOUT
    app.get(prefix+'/logout', function(req, res){
        //delete req.session.User;
        req.session.destroy();
        res.redirect('/');
    });

}