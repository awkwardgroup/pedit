// Create namespace
var PEDIT = PEDIT || {};

PEDIT = {
  // Set namespace variables
  mouseStartX: 0,
  mouseStartY: 0,
  mouseEndX: 0,
  mouseEndY: 0,
  isTouchDevice: false,

  init:function(editorID) {
    // Get the editor element by ID
    var element = document.getElementById(editorID);

    // Check if touch device
    this.isTouchDevice = PEDIT.tools.isTouchDevice();

    // Create and return an editor object
    return new PEDIT.Editor(element);
  },

  Editor:function(element) {
    // Set object reference
    var editor = this;

    // Set object properties
    editor.element = element;
    editor.width = element.offsetWidth;
    editor.height = element.offsetHeight;
    editor.offset = 0;
    editor.remove = true;
    editor.resize = true;
    editor.percent = true;
    editor.updateChildMaxSize = true;
    editor.childMaxWidth = 0;
    editor.childMaxHeight = 0;
    editor.childMinWidth = 10;
    editor.childMinHeight = 10;
    editor.childTrailID = 1;
    editor.moveDoneFunction = null;
    editor.resizeDoneFunction = null;
    editor.removeDoneFunction = null;
    editor.childRenderedFunction = null;
    editor.children = {};
    
    /*********
      EVENTS
    *********/
    PEDIT.events.mouseDown(editor.element, function(e) {
      // IE8 fix
      e = e || window.event;

      // Update object properties on mouse down
      // Set mouse position
      var xy = PEDIT.tools.getPageXY(e);
      PEDIT.mouseStartX = xy[0];
      PEDIT.mouseStartY = xy[1];
      PEDIT.mouseEndX = xy[0];
      PEDIT.mouseEndY = xy[1];

      // Update editor size
      editor.width = editor.element.offsetWidth;
      editor.height = editor.element.offsetHeight;

      // Update child max size
      if ( editor.updateChildMaxSize ) {
        editor.childMaxWidth = 100;
        editor.childMaxHeight = 100;
      }
    });

    /************
      FUNCTIONS
    ************/
    editor.render = function() {
      // Get all children
      var elements = editor.element.children;
      var elementsClean = [];

      // Only add elements that don't have and id attribute,
      // that is because they have not been rendered.
      for (var i = 0, n = elements.length; i < n; i++) {
        if (!elements[i].getAttribute('data-child-id')) {
          elementsClean.push(elements[i]);
        }
      }

      // Loop through children list
      for (i = 0; i < elementsClean.length; i++) {
        // Add child to the editor
        editor.createChild(elementsClean[i]);
      }
    };

    editor.createChild = function(element) {
      // Create a child object
      var child = new PEDIT.Child(editor, element, editor.childTrailID);
      // Add child object to editors children object
      editor.children[editor.childTrailID] = child;
      // Set element id as attribute
      element.setAttribute('data-child-id', editor.childTrailID);
      // Increase trail ID
      editor.childTrailID++;
      // Return child object
      return child;
    };

    editor.calculateSize = function(pixels, horizontal) {
      var size = pixels / (editor.width - editor.offset) * 100;
      if (!horizontal) {
        size = pixels / (editor.height - editor.offset) * 100;
      }
      return size;
    };

    editor.getChild = function(id) {
      return editor.children[id];
    };
  },

  Child:function(editor, element, id) {
    // Set object references
    var child = this;

    // Set object properties
    child.id = id;
    child.element = element;
    child.elementResize = null;
    child.elementRemove = null;
    child.editor = editor;
    child.locked = false;

    /******************
      RENDER ELEMENTS
    ******************/
    // Get all images in child
    images = element.getElementsByTagName('img');

    // If an image exists
    if (typeof images[0] !== 'undefined') {
      // Set interval to 10 miliseconds
      var interval = setInterval(function() {
        // Check if the image is loaded
        if (images[0].complete) {
          // Render child
          renderChild();
          // Clear interval
          clearInterval(interval);
        }
      }, 10);
    }
    else {
       // Render child directly
      renderChild();
    }

    function renderChild() {
      // Set dynamic object properties
      child.width = editor.calculateSize(element.offsetWidth, true);
      child.height = editor.calculateSize(element.offsetHeight, false);
      child.offsetX = editor.calculateSize(element.offsetLeft, true);
      child.offsetY = editor.calculateSize(element.offsetTop, false);

      // Update child element dimensions
      child.element.style.width = child.width + '%';
      child.element.style.height = child.height + '%';

      // Render resize element
      if (child.editor.resize) {
        child.elementResize = document.createElement('div');
        child.elementResize.className = 'resize';
        child.element.appendChild(child.elementResize);
      }

      // Render remove element
      if (child.editor.remove) {
        child.elementRemove = document.createElement('div');
        child.elementRemove.className = 'remove';
        child.element.appendChild(child.elementRemove);
      }
      
      /*********
        EVENTS
      *********/
      PEDIT.events.mouseDown(child.element, function() {
        // Update offset limits
        child.updateOffsetLimits();
        // Move
        child.move();
      });
      
      if (child.elementResize) {
        PEDIT.events.mouseDown(child.elementResize, function() {
          // Lock object
          child.locked = true;
          // Resize
          child.resize();
        });
      }
      
      // TODO: Redo this, don't think everything is necessary, can't slide of on touch
      if (child.elementRemove) {
        PEDIT.events.mouseDown(child.elementRemove, function(e) {
          // IE8 fix
          e = e || window.event;

          // Stop default event behaviour for touch devices
          if (PEDIT.isTouchDevice) {
            e.preventDefault();
            //e.stopPropagation();
          }

          // Lock object
          child.locked = true;

          // Remove on mouse up over element
          PEDIT.events.mouseUp(child.elementRemove, function() {
            // Remove
            child.remove();
            // Run dynamic end function (put here only to run on GUI interaction)
            if (typeof editor.removeDoneFunction === 'function') {
              editor.removeDoneFunction(child);
            }
          });

          // Reset on document mouseup 
          PEDIT.events.mouseUp(document, function() {
            // Unlock child
            child.locked = false;
          });
        });
      }
      
      // Run dynamic end function
      if (typeof editor.childRenderedFunction === 'function') {
        editor.childRenderedFunction(child);
      }
    }

    /************
      FUNCTIONS
    ************/
    child.updateOffsetLimits = function() {
      // Update child offsets
      child.offsetLimitX = 100 - child.width;
      child.offsetLimitY = 100 - child.height;
    };

    child.move = function() {
      // Set function variables
      var offsetX = child.offsetX;
      var offsetY = child.offsetY;

      // If child is locked, stop!
      if ( child.locked) { return; }
      
      var moveElement = function(e) {
        // IE8 fix
        e = e || window.event;

        // Stop default event behaviour for touch devices
        if (PEDIT.isTouchDevice) {
          e.preventDefault();
          //e.stopPropagation();
        }

        // Update mouse end position
        var xy = PEDIT.tools.getPageXY(e);
        PEDIT.mouseEndX = xy[0];
        PEDIT.mouseEndY = xy[1];

        // Set child offset X
        offsetX = child.offsetX + editor.calculateSize((PEDIT.mouseEndX - PEDIT.mouseStartX), true);
        offsetX = offsetX < 0 ? 0 : offsetX;
        offsetX = offsetX > child.offsetLimitX ? child.offsetLimitX : offsetX;
        child.element.style.left = offsetX + '%';


        // Set child offset Y
        offsetY = child.offsetY + editor.calculateSize((PEDIT.mouseEndY - PEDIT.mouseStartY), false);
        offsetY = offsetY < 0 ? 0 : offsetY;
        offsetY = offsetY > child.offsetLimitY ? child.offsetLimitY : offsetY;
        child.element.style.top = offsetY + '%';
      };
      // Connect moveElement function to document event
      PEDIT.events.mouseMove(document, moveElement);

      var moveElementDone = function() {
        // Unbind move events
        PEDIT.events.mouseMove(document, moveElement, true);
        PEDIT.events.mouseUp(document, moveElementDone, true);
        // Update child offset variables
        child.offsetX = offsetX;
        child.offsetY = offsetY;
        // Run dynamic end function
        if (typeof editor.moveDoneFunction === 'function') {
          editor.moveDoneFunction(child);
        }
      };
      // Connect moveElementDone function to document event
      PEDIT.events.mouseUp(document, moveElementDone);
    };

    child.resize = function() {

      var resizeElement = function(e) {
        // IE8 fix
        e = e || window.event;

        // Stop default event behaviour for touch
        if (PEDIT.isTouchDevice) {
          e.preventDefault();
          //e.stopPropagation();
        }

        // Update mouse start position
        var xy = PEDIT.tools.getPageXY(e);
        PEDIT.mouseStartX = xy[0];
        PEDIT.mouseStartY = xy[1];

        // Calculate element ratio
        var ratio = child.height / child.width;

        // Calculate distance between points
        var horizontalChange = PEDIT.mouseStartX - PEDIT.mouseEndX;
        var dx = horizontalChange * horizontalChange;
        var verticalChange = PEDIT.mouseStartY - PEDIT.mouseEndY;
        var dy = verticalChange * verticalChange;
        var distance = Math.sqrt(dx + dy) * 1.5;
        distance = horizontalChange >= 0 && verticalChange >= 0 ? distance : -distance;

        // Set new width and height
        var width = child.width + editor.calculateSize((distance), true);
        var height = ratio * width;

        // Updated element position
        child.updateElementSize(width, height);

        // Update mouse end position
        PEDIT.mouseEndX = xy[0];
        PEDIT.mouseEndY = xy[1];
      };
      // Connect resizeElement function to document event
      PEDIT.events.mouseMove(document, resizeElement);

      var resizeElementDone = function() {
        // Unbind move events
        PEDIT.events.mouseMove(document, resizeElement, true);
        PEDIT.events.mouseUp(document, resizeElementDone, true);
        // Unlock child
        child.locked = false;
        // Run dynamic end function
        if (typeof editor.resizeDoneFunction === 'function') {
          editor.resizeDoneFunction(child);
        }
      };
      // Connect resizeElementDone function to document event
      PEDIT.events.mouseUp(document, resizeElementDone);
    };

    child.updateElementSize = function(width, height) {
        // If image is to big or to small, stop!
        if ( width > child.editor.childMaxWidth || width < child.editor.childMinWidth ) { return; }
        if ( height > child.editor.childMaxHeight || height < child.editor.childMinHeight ) { return; }

        // Set size changes
        var widthChange = width - child.width;
        var heightChange = height - child.height;

        // Update child size
        if (widthChange > 0) {
          child.width = width > 99 ? 100 : width;
          child.height = height > 99 ? 100 : height;
        }
        else {
          child.width = width;
          child.height = height;
        }

        // Update offset limits after changing size
        child.updateOffsetLimits();

        // Set element size
        child.element.style.width = child.width + '%';
        child.element.style.height = child.height + '%';

        // Set element position
        var offsetX = child.offsetX - (widthChange / 2);
        var offsetY = child.offsetY - (heightChange / 2);
        child.updateElementPosition(offsetX, offsetY);
    };

    child.updateElementPosition = function(offsetX, offsetY) {
      // Check if image is out of bound
      if ( offsetX < 0 ) { offsetX = 0; }
      else { offsetX = offsetX > child.offsetLimitX ? child.offsetLimitX : offsetX; }

      if ( offsetY < 0 ) { offsetY = 0; }
      else { offsetY = offsetY > child.offsetLimitY ? child.offsetLimitY : offsetY; }

      // Set element position
      child.element.style.left = offsetX + '%';
      child.element.style.top = offsetY + '%';
      
      // Update child offset variables
      child.offsetX = offsetX;
      child.offsetY = offsetY;
    };

    child.remove = function() {
      // Remove element from DOM
      child.editor.element.removeChild(child.element);
      // Remove object from editors children object
      delete child.editor.children[child.id];
    };
  }
};

PEDIT.events = {
  mouseDown: function(element, _function, remove) {
    this.bindEvent('down', element, _function, remove);
  },
  mouseUp: function(element, _function, remove) {
    this.bindEvent('up', element, _function, remove);
  },
  mouseMove: function(element, _function, remove) {
    this.bindEvent('move', element, _function, remove);
  },
  bindEvent: function(type, element, _function, remove) {
    // Touch
    if (PEDIT.isTouchDevice) {
      if (type === 'down') { 
        if (remove) { element.removeEventListener("touchstart", _function, false); }
        else { element.addEventListener("touchstart", _function, false); }
      }
      else if (type === 'up') {
        if (remove) { element.removeEventListener("touchend", _function, false); }
        else { element.addEventListener("touchend", _function, false); }
      }
      else if (type === 'move') {
        if (remove) { element.removeEventListener("touchmove", _function, false); }
        else { element.addEventListener("touchmove", _function, false); }
      }
    }
    // Mouse
    else {
      if (type === 'down') {
        if (remove) { element.onmousedown = null; }
        else { element.onmousedown = _function; }
      }
      else if (type === 'up') {
        if (remove) { element.onmouseup = null; }
        else { element.onmouseup = _function; }
      }
      else if (type === 'move') {
        if (remove) { element.onmousemove = null; }
        else { element.onmousemove = _function; }
      }
    }
  }
};

PEDIT.tools = {
  isTouchDevice: function() {  
    try {
      document.createEvent("TouchEvent");  
      return true;  
    }
    catch (e) {
      return false;  
    }
  },
  getPageXY: function(e) {
    if (typeof e.touches !== 'undefined') {
      return [e.touches[0].pageX, e.touches[0].pageY];
    }
    else {
      return [e.x, e.y];
    }
  },
  addTouchClass: function(className) {
    var hasClass = (' ' + document.body.className + ' ').indexOf(' ' + className + ' ') > -1;
    if (!hasClass && PEDIT.isTouchDevice) {
      document.body.className += document.body.className !== '' ? ' ' + className : className;
    }
  },
  // For dev purpose
  console: function(text, clean) {
    var html = document.getElementById('debug').innerHTML;
    html = clean ? text + '<br>' + html : text;
    document.getElementById('debug').innerHTML = html;
  }
};