PEdit
=====
Edit multiple HTML elements within a specific area (editor). No libraries needed, just good old JavaScript.

Developed by the team behind www.printees.se.

*Features*
- Resize element (ratio driven)
- Move element
- Remove element

## Browser Support
IE7+, Chrome, Opera, Safari

## Setup
1. initialize the editor by ID
'var editor = PEDIT.init('editor');'

2. Configure editor options (optional)
'editor.offset = 2;'

3. Render children
'editor.render();'

## Add children (elements) dynamically
1. Create a new element and add it to the editor element
'var element = document.createElement('div');
editor.element.appendChild(element);'

2.1 Render children
'editor.render();'

2.2 Or add child directly to get an object reference
'var child = editor.addChild(element)'

