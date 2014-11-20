$(function() {
  $.fn.swipe = function( callback ) {
    var touchDown = false,
      originalPosition = null,
      $el = $( this );

    function swipeInfo( event ) {
      var x = event.originalEvent.pageX,
        y = event.originalEvent.pageY,
        dx, dy;

      dx = ( x > originalPosition.x ) ? "right" : "left";
      dy = ( y > originalPosition.y ) ? "down" : "up";

      return {
        direction: {
          x: dx,
          y: dy
        },
        offset: {
          x: x - originalPosition.x,
          y: originalPosition.y - y
        }
      };
    }

    $el.on( "touchstart", function ( event ) {
      touchDown = true;
      originalPosition = {
        x: event.originalEvent.pageX,
        y: event.originalEvent.pageY
      };
    } );

    $el.on( "touchend", function () {
      touchDown = false;
      originalPosition = null;
    } );

    $el.on( "touchmove", function ( event ) {
      if ( !touchDown ) { return;}
      var info = swipeInfo( event );
      var result = callback( info.direction, info.offset );

      if (result === false) {
        $el.trigger('touchend');
        return result;
      }
    } );

    return true;
  };
});
