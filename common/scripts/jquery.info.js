
var infoWindow;
var docHtml;

( function ( $ ) 
{
    $.fn.info = function()
    {
        var elem = this;
        this.bind( "displayInfo",
                   function( event )
                   {
                       openInfoWindow( true );

                       console.log( "Displaying Info for : " + event.target.id );
                       var infoLink = $( event.target ).find( "a.info-circle" );
                       if ( infoLink && $( infoLink ).attr( "href" ) )
                       {
                           infoWindow.location.href = $( infoLink ).attr( "href" );
                       }
                   }
                 );
	return this;
    }    
} ( jQuery ) );

function openInfoWindow( clicked = false )
{
    if ( ! infoWindow )
    {
        infoWindow = window.open( "doc.html", "Info", "width=256,height=256,menubar=no,status=no,left=500,top=500" );
        if ( infoWindow )
        {
            infoWindow.addEventListener( "load", 
                                         function()
                                         {
                                             console.log( "InfoWindow: " + $( "body", infoWindow.document ).html() );                                
                                         }
                                       );
        }
        else
        {
            if ( clicked )
            {
                alert( "Please disable your pop-up blocker" );
            }
            else
            {
                console.error( "Popup blocker detected" );
            }
        }
    }
}


$( function()
   {
       openInfoWindow();

       console.log("Gettign local doc.html");
       $.get( "doc.html",
              function( data )
              {
                  console.log( "Got doc.html");
                  docHtml = data;
                  
                  $( docHtml )
                      .filter( "div[selector]" )
                      .each( function()
                             {
                                 var id = $( this ).attr( "id" );
                                 var selector = $( this ).attr( "selector" );

                                 var iLink = $( '<a class="info-circle" href="doc.html#' + id + '" target="Info"><img id="play" width="32" height="32" src="../common/styles/Buttons/Info.png"/></a>' )
                                     .css( "text-decoration", "none" );
                                 var iDiv = $( "<div></div>" )
                                     .css( "float" , "right" )
                                     .append( iLink );
                                 $( selector ).prepend( iDiv );
                                 //console.log( $( this ).html() );
                             }
                           );
              }
            );
   }
 );
