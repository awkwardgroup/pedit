angular.module('presizable', []).
  directive('presizable', function($window) {
    return function(scope, element, attr) {

      if ("ontouchstart" in document.documentElement)
      {
        // It's a touch device
        var scale,
            _width = element.width();
  
        element.on('gesturestart', function(e){
          e.preventDefault();
        });
  
        element.parent().on('gesturechange', function(e){
          e.preventDefault();
  
//          scale = e.scale;
          scale = e.originalEvent.scale;
          var tempWidth = _width * scale;
          console.log(_width);
          console.log(scale);
          console.log(tempWidth);
/*  
          element.css({
              'width': tempWidth + 'px',
              'height': tempWidth + 'px'
          });
          */
          element.width(tempWidth);
//          element.height(tempHeight);
          element.trigger('resize');
        });
  
        element.on('gestureend', function(e){
          e.preventDefault();
  
          _width = parseInt(element.css('width'));
        });
      }
      else
      {
        // It's not a touch device
        var handles = ['tl', 'tm', 'tr', 'ml', 'mr', 'bl', 'bm', 'br'],
            clickedHandle,
            lastMouseX,
            lastMouseY;
        function mouseMove(e){
          e.preventDefault();
          var viewportOffset = element[0].getBoundingClientRect(),
              parentViewportOffset = element.parent()[0].getBoundingClientRect();
          
          if( e.clientY > lastMouseY && e.clientX > lastMouseX ){
//            console.log("BÄGGE");
          }
          
          switch( clickedHandle ){
            case 'tm':
              var _top = e.clientY - parentViewportOffset.top,
                  _height = element.height() + (lastMouseY - e.clientY),
                  _width = _height * (element.width() / element.height()),
                  _left = e.clientX - parentViewportOffset.left - (_width/2);
              element.width(_width);
              element.css({
                top: _top,
                left: _left
              });
            break;
            case 'tl':
              var _left = e.clientX - parentViewportOffset.left,
                  _top = e.clientY - parentViewportOffset.top,
                  _width = element.width() + (lastMouseX - e.clientX);
              element.width(_width);
              element.css({
                left: _left,
                top: _top
              });
              
            break;
            case 'tr':
            case 'mr':
            case 'br':
              element.width(e.clientX - viewportOffset.left);
            break;
            case 'tl':
            case 'ml':
            case 'bl':
              var _left = e.clientX - parentViewportOffset.left,
                  _width = element.width() + (lastMouseX - e.clientX);
              element.width(_width);
              element.css({
                left: _left
              });
            break;
            case 'tl':
            case 'tm':
            case 'tr':
//              console.log("HEJ");
            break;
          }
          lastMouseX = e.clientX;
          lastMouseY = e.clientY;
          element.trigger('resize');
        }
        for(var i=0;i<handles.length;i++)
        {
          var _handleName = handles[i];
          var _handle = angular.element('<div>').addClass('presizable presizable-' + _handleName).attr('data-handle', _handleName);
          _handle.on('mousedown', function(e){
            e.stopPropagation();
            clickedHandle = e.target.getAttribute('data-handle'),
            lastMouseX = e.clientX,
            lastMouseY = e.clientY;
            angular.element($window).on('mousemove', mouseMove);
          });
          angular.element($window).on('mouseup', function(e){
            angular.element($window).unbind('mousemove', mouseMove);
          });
          element.append(_handle);
        }
      }
    }
  });