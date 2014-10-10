
// Create namespace
var PEDIT = PEDIT || {};

PEDIT = {
  init: function(editorID) {

    // Create global array for editors
    PEDIT.editors = PEDIT.editors || [];
    
    // Get the editor element by ID and add to a private variable
    var editor = document.getElementById(editorID);

    // Create an object for the editor element and add it to the editors array
    PEDIT.editors.push(new PEDIT.Editor.init(editor));
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