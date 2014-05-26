$(function() {

    function getParameterByName(name) {
        name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
        var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
            results = regex.exec(location.search);
        return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
    }

    //MODEL DEFENITIO
    var Page = Backbone.Model.extend({
        defaults: {
            Content: "",
            StartPos: 0,
            EndPos: 0
        },
        initialize: function () {
            console.log('Category "' + this.get('Content') + '" with start "' + this.get('StartPos') + '" and end ' + this.get('EndPos'));
        }
    });

    //COLLECTION FOR MODELS(list)
    var PageList = Backbone.Collection.extend({
        url:'http://localhost:3000/Books/get',
        model: Page
    });

    //COLLECTION INITIALIZATION
    var Pages = new PageList();


    var PageView = Backbone.View.extend({
        collection:Pages,
        BookId:-1,
        CurrentCharStart:0,
        CurrentCharEnd:0,
        ContentAmount:2000,
        initialize: function(){
            this.BookId = parseInt(getParameterByName('id'));
            this.collection.on('reset', this.render, this);
            Pages.fetch({reset: true,type: 'POST',data:{id:this.BookId,StartPos:this.CurrentCharStart,Padding:this.ContentAmount} });
        },
        render: function(){

            var renderVar= this.collection.toJSON();
            this.CurrentCharStart = renderVar[0].StartPos;
            this.CurrentCharEnd = renderVar[1].EndPos;
            var template = _.template( $("#Book_template").html(), {collection: renderVar} );
            this.$el.html( template );

            $( "#BookContentFrame" ).mouseup(function(e) {
                var text = "";
                if (window.getSelection) {
                    text = window.getSelection().toString();
                } else if (document.selection && document.selection.type != "Control") {
                    text = document.selection.createRange().text;
                }
                //alert(text.toString());
                if(text.toString().length!=0){
                    Selected_Text = text;
                    $("#DropDown").css({position:"absolute",display:'block', left:e.pageX,top:e.pageY});
                }
            });

        },
        events: {
            "click #LeftButton" : "PrevPageChange",
            "click #RightButton": "NextPageChange"
        },
        NextPageChange: function( event ) {
            Pages.fetch({reset: true,type: 'POST',data:{id:this.BookId,StartPos:this.CurrentCharEnd,Padding:this.ContentAmount} });
        },
        PrevPageChange: function( event ) {
            Pages.fetch({reset: true,type: 'POST',data:{id:this.BookId,StartPos:this.CurrentCharStart-this.ContentAmount*2,Padding:this.ContentAmount} });
        }
    });

    var page_view = new PageView({ el: $("#MainFrame") });

});