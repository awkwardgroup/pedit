

angular.module('pdraggable', []).
  directive('pdraggable', function($window) {
    return function(scope, element, attr) {
      element.css({
        position: 'absolute',
      });
      
      var elementOffsetX,
          elementOffsetY;
      
      element.on('mousedown touchstart', function(e){
        e.preventDefault();
        var viewportOffset = element[0].getBoundingClientRect();

        if( e.originalEvent.touches !== undefined ){
          elementOffsetX = (e.originalEvent.touches[0].pageX - viewportOffset.left)
          elementOffsetY = (e.originalEvent.touches[0].pageY - viewportOffset.top)
        }else{
          elementOffsetX = (e.clientX - viewportOffset.left)
          elementOffsetY = (e.clientY - viewportOffset.top)
        }
        angular.element($window).on('mousemove touchmove', onMouseMove);
        angular.element($window).on('mouseup touchend', function(e){
          angular.element($window).unbind('mousemove touchmove', onMouseMove, true);
        });
      })
      
      function onMouseMove(e){
      
        if( e.originalEvent.touches !== undefined ){
          if(e.originalEvent.touches.length > 1){
            return;
          }
          var clientX = e.originalEvent.touches[0].pageX,
              clientY = e.originalEvent.touches[0].pageY;
        }else{
          var clientX = e.clientX,
              clientY = e.clientY;
        }
        
        var parentViewportOffset = element.parent()[0].getBoundingClientRect(),
            viewportOffset = element[0].getBoundingClientRect(),
            elementTop = clientY - parentViewportOffset.top - (elementOffsetY),
            elementLeft = clientX - parentViewportOffset.left - (elementOffsetX);

        // If the click/touch is outside the parent element, get out of here!
        if( elementLeft < 0 ){
          elementLeft = 0;
        }else if( ( elementLeft ) > ( element.parent().width() - element.width() ) ){
          elementLeft = element.parent().width() - element.width();
        }

        if( elementTop < 0 ){
          elementTop = 0;
        }else if( elementTop > ( element.parent()[0].offsetHeight - element.height() ) ){
          elementTop = element.parent()[0].offsetHeight - element.height();
        }

        element.css({
          top: (100 * elementTop / element.parent()[0].offsetHeight) + '%',
          left: (100 * elementLeft / element.parent().width()) + '%'
        });
        element.css({
//          top: elementTop + 'px',
//          left: elementLeft + 'px'
        });
        
        element.trigger('drag');
      }
    }
  });
  