

/**
 * Schedules is a list of schedule objects in the following format:
 * [ 
 *     {
 *         src : "#lds",
 *         dst : "#dms",
 *         highlight: "#rs",
 *         func : function() {},
 *         duration : 2000,
 *         desc : "LDS sends its checkpoint to DMS"
 *     },
 *     {
 *         ...
 *     }
 * ]
 *
 * $.scheduleState: play, pause, step
 *     This state controls whether we are continuously animating or paused.
 *
 *  
 */
function schedule( schedules, stepDelay )
{
    var timer = 0;

    for ( i = 0; i < schedules.length; i++)
    {
        sc = schedules[i];

        // Set description
        setTimeout(
            displayDescription,
            timer,
            sc.desc,
            sc.duration,
            ( sc.src && sc.dst ) ? 5 * sc.duration : 3 * sc.duration,
            sc.highlight
        );
        timer = timer + 3 * sc.duration;
        
        // Draw arrows
        if ( sc.src && sc.dst )
        {
            $( sc.src )
                .shootArrowTo(
                    $( sc.dst ),
                    timer,
                    2 * sc.duration
                );
            timer = timer + sc.duration;
        }

        // Invoke function
        setTimeout( sc.func, timer );
        timer = timer + sc.duration;
        
        // Remove description
        setTimeout( function( )
            {
                $( "#desc" ).html( "<h3>&nbsp;</h3>" );
            },
            timer
        );
        timer = timer + sc.duration;
    }
}

/**
 * eCurrentStep: desc, arrow, invoke, clear
 */
function processNextSchedule( schedules, delay, iSchedule, eCurrentStep )
{
    if ( $.scheduleState == "play" )
    {
        //if ()
    }
    else if ( $.scheduleState == "pause" )
    {
        
    }
}

function displayDescription( desc, duration, highlightDuration, highlight )
{
    //$( "#desc" ).append( getMediaControlButtonNode() );

    $( "<h3>" + desc + "</h3>" )
        .appendTo( "#desc" )
        .css( "opacity", 0.0 )
        .css( "position", "relative" )
        .css( "top", -100 )
        .animate(
            {
                opacity: 1.0,
                top: 0
            },  duration );

    // Highlight component
    if ( highlight )
    {
        var oldColor = 
            $( highlight )
            .css( "color" );
        
        var oldBgColor = 
            $( highlight )
            .css( "background-color" );
        
        $( highlight )
            .css( "color", "Blue" );

        $( highlight )
            .css( "background-color", "pink" );

        // Restore old color
        setTimeout( function()
                    {
                        $( highlight )
                            .css( "color", oldColor )
                            .css( "background-color", oldBgColor );
                    },
                    highlightDuration
                  );
    }
}

// &#x25B6;&#xFE0F; Play Emoji
// &#x23F8; Pause Emoji

function getMediaControlButtonNode()
{
    if ( $.scheduleState == "play" )
    {
        return $.schedulePauseButton;
    }
    else if ( $.scheduleState == "pause" )
    {
        return $.schedulePlayButton;
    }
    else
    {
        alert( "Wrong Schedule State [" + $.scheduleState + "]" );
    }
}


$( function()
   {
       $.scheduleState = "play";

       $.schedulePlayButton = $( '<img id="play" width="64" height="64" src="../common/styles/Buttons/Play.png"/>' );
       $.schedulePlayButton.click( function()
                                   {
                                       $.scheduleState = "play";
                                   }
                                 );

           $.schedulePauseButton = $( '<img id="pause" width="64" height="64" src="../common/styles/Buttons/Pause.png"/>' );
           $.schedulePauseButton.click( function()
                                        {
                                            $.scheduleState = "pause";
                                        }
                                      );

       //if ( $.trim( $( "#desc" ).html() ) == "" )
       //{
       //    $( "#desc" ).append( getMediaControlButtonNode() );
       //}
   }
);
