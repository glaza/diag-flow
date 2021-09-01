
( function ( $ ) {
    $.fn.arrowTo = function( destination )
    {
        $( this ).each(
            function( srcIndex, sourceElem )
            {
                $( destination ).each(
                    function( dstIndex, destElem )
                    {
                        setTimeout( function()
                                    {
                                        drawArrow( sourceElem, destElem );
                                    },
                                    100
                                  );
                    }
                );
            }
        );
        return this;
    }

    $.fn.shootArrowTo = function( destination, when, duration = 1000 )
    {
        var sources = $( this );
        setTimeout( function()
                    {
                        $( sources ).each(
                            function( srcIndex, sourceElem )
                            {
                                $( destination ).each(
                                    function( dstIndex, destElem )
                                    {
                                        setTimeout( function()
                                                    {
                                                        var arrowElems = drawArrow( sourceElem, destElem );
                                                        setTimeout( function()
                                                                    {
                                                                        $( arrowElems[0] ).remove();
                                                                        $( arrowElems[1] ).remove();
                                                                    },
duration
                                                                  );
                                                    },
                                                    100
                                                  );
                                    }
                                );
                            }
                        );
                    },
                    when
                  );
        return $( this );
    }
} ( jQuery ) );

function getMiddle( start, end )
{
    return { x: ( start.x + end.x ) / 2,
             y: ( start.y + end.y ) / 2 };
}

function drawArrow( source, destination )
{
    var sourcePosition = $( source ).offset();
    var start = { x: sourcePosition.left + ( $( source ).width() / 2 ),
                  y: sourcePosition.top + ( $( source ).height() / 2 ) };
    var srcRange = { min: { x: sourcePosition.left,
                            y: sourcePosition.top },
                     max: { x: sourcePosition.left + $( source ).width(),
                            y: sourcePosition.top + $( source ).height() } }
    
    var destPosition = $( destination ).offset();
    var end = { x: destPosition.left + ( $( destination ).width() / 2 ),
                y: destPosition.top + ( $( destination ).height() / 2 ) };
    var dstRange = { min: { x: destPosition.left,
                            y: destPosition.top },
                     max: { x: destPosition.left + $( destination ).width(),
                            y: destPosition.top + $( destination ).height() } }

    start = intersect( start, end, srcRange );
    end = intersect( end, start, dstRange );
    
    var deltaX = end.x - start.x;
    var deltaY = end.y - start.y;
    var diagonal = Math.sqrt( Math.pow( deltaX, 2 ) + Math.pow( deltaY, 2 ) );
    var angle = Math.atan( deltaY / deltaX ) * 180 / Math.PI;

    /*console.log( "source height = " + $( source ).height() );
    console.log( "delta = [" + deltaX + ", " + deltaY + "]" );
    console.log( "diagonal = " + diagonal );
    console.log( "angle = " + angle );*/

    var arrowHead = $( ( start.x < end.x ) ? "<span>&gt;</span>" : "<span>&lt;</span>" )
        .css( "position", "absolute" )
        .css( "left", end.x - 5 )
        .css( "top", end.y - 8 )
        .css( "transform", "rotate(" + angle + "deg)" )
        .appendTo( $( source ) );

    var mid = getMiddle( start, end );
    var midUnrotated = getMiddle( start, { x: start.x + diagonal, y: start.y } );
    var startUnrotated = { x: start.x - ( midUnrotated.x - mid.x ), y: mid.y };
    
    var line = $( "<hr />" )
        .css( "position", "absolute" )
        .css( "left", startUnrotated.x )
        .css( "top", startUnrotated.y )
        .css( "width", "" + diagonal + "px" )
        .css( "height", "0px" )
        .css( "transform", "rotate(" + angle + "deg)" )
        .css( "margin", "0px" )
        .css( "padding", "0px" )
        .appendTo( $( source ) );

    return [ line, arrowHead ];

}


function isOutside( point, range )
{
    return point.x <= range.min.x || point.x >= range.max.x || point.y <= range.min.y || point.y >= range.max.y;
}


//       range
// +--------------+
// | start *======|========* end
// +--------------+
//
// Assumptions:
//  - start is inside the range
//  - end is outside the range
//  - start and end are points { x: 0, y: 0 };
//  - range is { min: , max: };
function intersectRecursive( start, end, range, count )
{
    //console.log( "start = [" + start.x + ", " + start.y + "],\tend = [" + end.x + ", " + end.y + "]" );
    if ( count == 0 )
    {
        //console.log( "intersect = [" + end.x + ", " + end.y + "]" );
        return end;
    }

    var mid = getMiddle( start, end );
    
    if ( isOutside( mid, range ) )
    {
        return intersectRecursive( start, mid, range, count - 1 );
    }
    else
    {
        return intersectRecursive( mid, end, range, count - 1 );
    }
}

function intersect( start, end, range )
{
    return intersectRecursive( start, end, range, 10 );
}
