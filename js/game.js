(
    function(){
        "use strict";
        var app={
            "canvas":null,
            "width":null,
            "height":null,
            "context":null,
            "color":null
        };
        var _isCanvasSupported=function(canvasElt){
            return !! canvasElt.getContext;
        };
        app.setup=function(){
            this.canvas=document.querySelector('#dino');
            if(!_isCanvasSupported(this.canvas)){
                console.error('Oups canvas n’est pas supporté.');
            }
            this.width=this.canvas.width;
            this.height=this.canvas.height;
            this.context=this.canvas.getContext("2d");
            this.color="#E56D25";

            var game = new window.Dino(this);
        };
        app.setup();
    }
)();
