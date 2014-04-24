module.exports = function(models){
    console.log("Populating database");

    models.Category.count(function(err, count){
        if (err) {
            console.log(err.name + ": " + err.message);
        }

        if(count==0){
            models.Category.create([
                {Title:'Comedia',Description:'Livros de Comedia'},
                {Title:'Ciencia',Description:'Livros de Ciencia'},
                {Title:'Desporto',Description:'Livros de Desporto'}
            ],function (err, items) {
                if (err) {
                    console.log(err.name + ": " + err.message);
                }else{
                    console.log('Categories '+items.length+' Created');
                }
            });

        }else{
            console.log('DB already contains Categories');
        }
    });

    models.Language.count(function(err, count){
        if (err) {
            console.log(err.name + ": " + err.message);
        }

        if(count==0){
            models.Language.create([
                {Name:'Portugues',Code:'PT-PT'},
                {Name:'Ingles',Code:'EN-GB'},
                {Name:'Frances',Code:'FR-FR'},
                {Name:'Japones',Code:'JP-JP'}
            ],function (err, items) {
                if (err) {
                    console.log(err.name + ": " + err.message);
                }else{
                    console.log('Languages '+items.length+' Created');
                }
            });

        }else{
            console.log('DB already contains Languages');
        }
    });
    models.Book.count(function(err, count){
        if (err) {
            console.log(err.name + ": " + err.message);
        }

        if(count==0){
            models.Book.create([
                {Title:'Livro 1',Description:'Descriçao Livro 1',FileType:'.pdf'},
                {Title:'Livro 2',Description:'Descriçao Livro 2',FileType:'.pdf'},
            ],function (err, items) {
                if (err) {
                    console.log(err.name + ": " + err.message);
                }else{
                    console.log('Books '+items.length+' Created');
                }
            });

        }else{
            console.log('DB already contains Books');
        }
    })

}