// Play: misc technical: x23F5, geomatric shapes: x25B6, misc arrows
var playButton = "<button>&#x25B6;&#x25B6;</button>"; 

// Pause: geometric shapes: x2503x2503, 
var pauseButton = "<button>&#x23F8;</button>";

// misc tech: x23EF, geomatric shapes: x25B6x2503 
var stepButton = "<button>&#x25B6;</button>"; 

// FF: misc tech: x23E9, misc arrows: x2BEE
var fastforwardButton = "<button>&#x23E9;</button>"; 


( function ( $ ) {
/*    $.fn.makePlayable = function( play )
    {
	var button = $( playButton ).click( pause );
	this.prepend( button );
	return this;
    }

    $.fn.makePlayPausable = function( play, pause )
    {
	var button = $( playButton ).click( play );
	this.prepend( button );
	return this;
    }
*/
    $.fn.makeStepable = function( stepFunction, enableFunction )
    {
        var elems = this;
        $( elems )
            .each( function ( index,  elem )
                   {
	               var button = $( stepButton ).click(
                           function( event )
                           {
                               wrapExecutable( elem, event, stepFunction );
                           }
                       );

                       if ( enableFunction )
                       {
                           setInterval(
                               function()
                               {
                                   if ( enableFunction() )
                                   {
                                       button.prop( "disabled", false ).show();
                                   }
                                   else
                                   {
                                       button.prop( "disabled", true ).hide();
                                   }
                               },
                               100
                           );
                       }
        
	               $( elem ).prepend( button );
	           }
                 );
        return elems;
    }
} ( jQuery ) );

function wrapExecutable( elem, event, exec )
{
    //if ( $( elem ).dislayInfo )
    //{
    //    $( elem ).displayInfo();
    //}
    exec( elem );
    event.preventDefault();
}
