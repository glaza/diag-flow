
$( function () 
   {
       setInterval( function()
                    {
                        var selection = window.location.href.split( "#" );
                        if ( selection.length == 2 )
                        {
                            $( "div.doc" )
                                .css( "background-color", "LightBlue" );
                            $( "#" + selection[1] )
                                .css( "background-color", "Violet" );
                        }
                    },
                    1000
                  );
   }
);
