// Create namespace
var PEDIT = PEDIT || {};

PEDIT = {
  // Set namespace variables
  mouseStartX: 0,
  mouseStartY: 0,
  mouseEndX: 0,
  mouseEndY: 0,

  init:function(editorID) {
    // Get the editor element by ID
    var element = document.getElementById(editorID);

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
    editor.children = [];

    /*********
      EVENTS
    *********/
    editor.element.onmousedown = function(e) { 
      // Update object properties on mouse down
      // Set mouse position
      PEDIT.mouseStartX = e.x;
      PEDIT.mouseStartY = e.y;
      PEDIT.mouseEndX = e.x;
      PEDIT.mouseEndY = e.y;

      // Update editor size
      editor.width = editor.element.offsetWidth;
      editor.height = editor.element.offsetHeight;

      // Update child max size
      if ( editor.updateChildMaxSize ) {
        editor.childMaxWidth = editor.width - editor.offset;
        editor.childMaxHeight = editor.height - editor.offset;
      }
    }

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
      for (var i = 0; i < elementsClean.length; i++) {
        // Add child to the editor
        editor.addChild(elementsClean[i]);
      }
    }

    editor.addChild = function(element) {
        // Create a child object
        var child = new PEDIT.Child(editor, element, editor.childTrailID)
        // Add child object to editors children array
        editor.children[editor.childTrailID] = child;
        // Set element id as attribute
        element.setAttribute('data-child-id', editor.childTrailID);
        // Increase trail ID
        editor.childTrailID++;
        // Return child object
        return child;
    }

    /*editor.getSizeValue() {
      if (editor.percent) {

      }
      else {
        return 
      }
    }*/
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
    child.width = element.offsetWidth;
    child.height = element.offsetHeight;
    child.offsetX = element.offsetLeft;
    child.offsetY = element.offsetTop;
    child.locked = false;

    /******************
      RENDER ELEMENTS
    ******************/
    if (child.editor.resize) {
      child.elementResize = document.createElement('div');
      child.elementResize.className = 'resize';
      child.element.appendChild(child.elementResize);
    }
    if (child.editor.remove) {
      child.elementRemove = document.createElement('div');
      child.elementRemove.className = 'remove';
      child.element.appendChild(child.elementRemove);
    }

    /*********
      EVENTS
    *********/
    child.element.onmousedown = function(e) {
      // Update offset limits
      child.updateOffsetLimits();
      // Move
      child.move();
    }

    if (child.elementResize) {
      child.elementResize.onmousedown = function(e) {
        // Lock object
        child.locked = true;
        // Resize
        child.resize();
      }
    }

    if (child.elementRemove) {
      child.elementRemove.onmousedown = function(e) {
        // Lock object
        child.locked = true;

        // Remove on mouse up over element
        child.elementRemove.onmouseup = function(e) {
          // Remove
          child.remove();
        }

        // Reset on mouseup 
        document.onmouseup = function(e) {
          // Unbind element event
          child.elementRemove.onclick = null;
          // Unlock child
          child.locked = false;
        }
      }
    }

    /************
      FUNCTIONS
    ************/
    child.updateOffsetLimits = function() {
      // Update child offsets
      child.offsetLimitX = editor.width - child.width - editor.offset
      child.offsetLimitY = editor.height - child.height - editor.offset;
    }

    child.move = function() {
      // Set function variables
      var offsetX = child.offsetX;
      var offsetY = child.offsetY;
      
      // If child is locked, stop!
      if ( child.locked) { return; }
      
      document.onmousemove = function(e) {
        // Update mouse end position
        PEDIT.mouseEndX = e.x;
        PEDIT.mouseEndY = e.y;
        
        // Set child offset X
        offsetX = child.offsetX + (PEDIT.mouseEndX - PEDIT.mouseStartX);
        offsetX = offsetX < 0 ? 0 : offsetX;
        offsetX = offsetX > child.offsetLimitX ? child.offsetLimitX : offsetX;
        child.element.style.left = offsetX + 'px';
        
        // Set child offset Y
        offsetY = child.offsetY + (PEDIT.mouseEndY - PEDIT.mouseStartY);
        offsetY = offsetY < 0 ? 0 : offsetY;
        offsetY = offsetY > child.offsetLimitY ? child.offsetLimitY : offsetY;
        child.element.style.top = offsetY + 'px';
      }

      document.onmouseup = function(e) {
        // Unbind event
        document.onmousemove = null;
        // Update child offset variables
        child.offsetX = offsetX;
        child.offsetY = offsetY;
      }
    }

    child.resize = function() {

      document.onmousemove = function(e) {
        // Update mouse start position
        PEDIT.mouseStartX = e.x;
        PEDIT.mouseStartY = e.y;

        // Set pixel changes
        var horizontalChange = PEDIT.mouseStartX - PEDIT.mouseEndX;
        var verticalChange = PEDIT.mouseStartY - PEDIT.mouseEndY;
        var overallChange = horizontalChange !== 0 ? horizontalChange : verticalChange;
        overallChange += overallChange/2; // Needed when expanding in all dimensions

        // Update element size
        child.updateElementSize(child.width + overallChange, child.height + overallChange);
        
        // Update mouse end position
        PEDIT.mouseEndX = e.x;
        PEDIT.mouseEndY = e.y;
      }

      document.onmouseup = function(e) {
        // Unbind document event
        document.onmousemove = null;
        // Unlock child
        child.locked = false;
      }
    }

    child.updateElementSize = function(width, height) {
        // If image is to big or to small, stop!
        if ( width > child.editor.childMaxWidth || width < child.editor.childMinWidth ) { return; }
        if ( height > child.editor.childMaxHeight || height < child.editor.childMinHeight ) { return; }

        // Set size changes
        var widthChange = width - child.width;
        var heightChange = height - child.height;

        // Update child size
        child.width = width;
        child.height = height;

        // Update offset limits after changing size
        child.updateOffsetLimits();

        // Set element size
        child.element.style.width = child.width + 'px';
        child.element.style.height = child.height + 'px';

        // Set element position
        var offsetX = child.offsetX - (widthChange / 2);
        var offsetY = child.offsetY - (heightChange / 2);
        child.updateElementPosition(offsetX, offsetY);
    }

    child.updateElementPosition = function(offsetX, offsetY) {
      // Check if image is out of bound
      if ( offsetX < 0 ) { offsetX = 0 }
      else { offsetX = offsetX > child.offsetLimitX ? child.offsetLimitX : offsetX; }

      if ( offsetY < 0 ) { offsetY = 0 }
      else { offsetY = offsetY > child.offsetLimitY ? child.offsetLimitY : offsetY; }

      // Set element position
      child.element.style.left = offsetX + 'px';
      child.element.style.top = offsetY + 'px';
      
      // Update child offset variables
      child.offsetX = offsetX;
      child.offsetY = offsetY;
    }

    child.remove = function() {
      // Remove element from DOM
      child.editor.element.removeChild(child.element);
      // Remove object from editor array
      child.editor.children.splice(child.id, 1);
      // Delete reference to the object
      delete child;
    }
  }
}