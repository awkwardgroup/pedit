
// Create namespace
var PEDIT = PEDIT || {};

PEDIT = {
  init: function(editorClass) {

    // Create global array for editors
    PEDIT.editors = PEDIT.editors || [];
    
    // Add all editor elements in the document to a private array
    var editors = document.getElementsByClassName(editorClass);

    // Loop through the private editor array
    for (var i = 0; i < editors.length; i++) {
      
      // Create an object for each editor element and add it to the editors array
      PEDIT.editors.push(new PEDIT.Editor.init(editors[i]));
    }
  }
}

// Editor class
PEDIT.Editor = {
  init: function(editor) {

    // Set editor dimensions
    this.width = editor.offsetWidth;
    this.height = editor.offsetHeight;

    // Create a global array for all children
    this.children = [];

    // Add all child elements in the editor to a private array
    var children = editor.getElementsByClassName('child')

    // Loop through the private children array
    for (var i = 0; i < children.length; i++) {
      
      // Create an object for each child element and add it to the children array
      this.children.push(new PEDIT.Child.init(this, children[i]));
    }
  }
}

PEDIT.Child = {
  init: function(editor, child) {

    // Set child dimensions
    this.width = child.offsetWidth;
    this.height = child.offsetHeight;

    child.onmousedown = function(e) {
      e.preventDefault();
      console.log( editor.width );
    };
  }
}