$(function(){
    //MODEL DEFENITIO
    var Category = Backbone.Model.extend({
        defaults:{
            id          :-1,
            Title       :'none',
            Description :'none',
            Selected    :false
        },
        initialize: function(){
            console.log('Category "'+ this.get('Title') + '" with description "'+ this.get('Description') +'" created');
        }
    });
    var Book = Backbone.Model.extend({
        defaults:{
            id              : -1,
            Title           : 'None',
            Description     : 'None',
            FileType        : '.???',
            ImgLink         : 'None'
        },
        initialize: function(){
            console.log('Book "'+ this.get('Title') + '" with description "'+ this.get('Description') +'" created');
        }
    });
    var Language = Backbone.Model.extend({
        defaults:{
            id              : -1,
            Name            : 'None',
            ImgUrl          : 'None',
            Code            : 'None',
            Selected        :false
        },
        initialize: function(){
            console.log('Language "'+ this.get('Name') + '" with Code: "'+ this.get('Code') +'" created');
        }
    });

    //COLLECTION FOR MODELS(list)
    var CategoryList= Backbone.Collection.extend({
        url:'http://localhost:3000/categories/get',
        model: Category
    });

    var BookList= Backbone.Collection.extend({
        url:'http://localhost:3000/books/get',
        model: Book
    });

    var LanguageList= Backbone.Collection.extend({
        url:'http://localhost:3000/languages/get',
        model: Language
    });

    var Categories = new CategoryList();
    Categories.fetch({reset: true,type: 'POST' });

    var Books = new BookList();
    Books.fetch({reset: true,type: 'POST' });

    var Languages = new LanguageList();
    Languages.fetch({reset: true,type: 'POST' });

    var CategoryView = Backbone.View.extend({
        collection:Categories,
        filter:'',
        initialize: function(){
            this.collection.on('reset', this.render, this);
            this.render();
        },
        render: function(){
            var renderVar= this.collection.toJSON();;
            var filter = this.filter;
            if(this.filter!='')
            {
                renderVar = renderVar.filter(function(cat) {
                    return cat.Title.toLowerCase().indexOf(filter.toLowerCase()) > -1;
                });
            }

            var template = _.template( $("#CategoryFilterBar_template").html(), {collection: renderVar} );
            this.$el.html( template );
            $('#CatFilterInput').val(this.filter);
        },
        events: {
            "click input[type=checkbox]": "UpdateSelected",
            "change #CatFilterInput":"FilterChange"
        },
        UpdateSelected: function( event ){
            var caller = event.target || event.srcElement;
            var catID = parseInt($(caller).val());
            this.collection.where({ id: catID}).Selected = $(caller).is(':checked') ;
        },
        FilterChange: function( event ){
            var caller = event.target || event.srcElement;
            this.filter = $(caller).val();
            this.render();
        }
    });

    var LanguageView = Backbone.View.extend({
        collection:Languages,
        filter:'',
        initialize: function(){
            this.collection.on('reset', this.render, this);
            this.render();
        },
        render: function(){
            var renderVar= this.collection.toJSON();
            var filter = this.filter;
            if(this.filter!='')
            {
                renderVar = renderVar.filter(function(lang) {
                    return lang.Name.toLowerCase().indexOf(filter.toLowerCase()) > -1;
                });
            }

            var template = _.template( $("#LanguageFilterBar_template").html(), {collection: renderVar} );
            this.$el.html( template );
            $('#LangFilterInput').val(this.filter);
        },
        events: {
            "click #LanguageFilterBar input[type=checkbox]": "UpdateSelected",
            "change #LangFilterInput":"FilterChange"
        },
        UpdateSelected: function( event ){
            var caller = event.target || event.srcElement;
            var langID = parseInt($(caller).val());
            this.collection.where({ id: langID}).Selected = $(caller).is(':checked') ;
        },
        FilterChange: function( event ){
            var caller = event.target || event.srcElement;
            this.filter = $(caller).val();
            this.render();
        }
    });

    var BookView = Backbone.View.extend({
        bookCollection:Books,
        LanguageCollection:Languages,
        CategoryCollection:Categories,
        filter:'',
        initialize: function(){
            this.bookCollection.on('reset', this.render, this);
            this.render();
        },
        render: function(){
            var renderVar= this.bookCollection.toJSON();
            var filter = this.filter;
            if(this.filter!='')
            {
                renderVar = renderVar.filter(function(lang) {
                    return lang.Name.toLowerCase().indexOf(filter.toLowerCase()) > -1;
                });
            }

            var template = _.template( $("#BookFilterBar_template").html(), {collection: renderVar} );
            this.$el.html( template );
            $('#BookFilterInput').val(this.filter);
        },
        events: {
            "keydown #BookFilterInput":"FilterChange"
        }
    });


    var category_view = new CategoryView({ el: $("#CategoryFilterBar") });
    var language_view = new LanguageView({ el: $("#LanguageFilterBar") });
    var book_view = new BookView({ el: $("#BookFilterBar") });
  });