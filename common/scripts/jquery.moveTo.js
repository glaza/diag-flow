
( function ( $ ) {
    $.fn.moveTo = function( destinationContainer )
    {
	return this.each(
	    function()
	    {
                var element = $( this );
		var elemPosition = $( this ).offset();
		                
                var elemWidth = $( this ).width();
                var elemHeight = $( this ).height();

                var destinationPlaceHolder =
                    createPlaceholder( $( destinationContainer ) )
                    .appendTo( $( destinationContainer ) )
                    .width( elemWidth )
                    .height( elemHeight )
                    .hide()
                    .slideDown(
                        getStepDelay(),
                        function() // complete
                        {
                            this.remove();
                        }
                    );
                                
                $( this )
		    .css( "position", "absolute" )
		    .offset( {
			left: elemPosition.left,
			top: elemPosition.top
		    } );               

		var destPosition = $( destinationPlaceHolder ).offset();

                var sourcePlaceHolder =
                    createPlaceholder( $( this ) )
                    .appendTo( element.parent() )
                    //.addClass( "container" )
                    //.css( "margin", elemHeight )
                    .width( elemWidth )
                    .height( elemHeight )
                    .slideUp(
                        getStepDelay(),
                        function() // complete
                        {
                            this.remove();
                        }
                    );                
                
		$( this )
		    .animate(
			{
			    left: destPosition.left,
			    top:  destPosition.top	
			},
			{
                            duration: getStepDelay(),
                            //step: function()
                            //{
                            //    var xDiff = $( destinationPlaceHolder ).offset().left - destPosition.left;
                            //    var yDiff = $( destinationPlaceHolder ).offset().top - destPosition.top;
                            //    $( this ).css( {
                            //        left: $( this ).offset().left += xDiff,
                            //        top: $( this ).offset().top -= yDiff
                            //    } );
                            //    console.log( "shifting by [" + xDiff + ", " + yDiff + "]" );
                            //},
			    complete: function()
			    {
			        $( this )
				    .appendTo( $( destinationContainer ) )
				    .css( "position", "static" );
			    }
                        } );
	    } );
    }

    /**
     * This method will animate the object towards the destination without it being appended to anything
     */
    $.fn.send = function( sourceContainer, destinationContainer )
    {
        var sourcePosition = $( sourceContainer ).offset();
        var destPosition = $( destinationContainer ).offset();
        
        $( this )
            .appendTo( $( sourceContainer ) )
            .css( "position", "absolute" )
            .css( "left", sourcePosition.left )
            .css( "top", sourcePosition.top )
            .animate(
		{
		    left: destPosition.left,
		    top:  destPosition.top	
		},
		getStepDelay(),
		function() // complete
		{
		    $( this )
			.appendTo( $( destinationContainer ) )
			.css( "position", "static" );
		} );
    }

    
} ( jQuery ) );
