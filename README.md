PEdit
=====
Edit multiple HTML elements within a specific area (editor). It's super easy to edit elements via a GUI or the object API. No libraries needed, just good old JavaScript.

Developed by the team behind www.printees.se.

_Features_
- Resize element (ratio driven)
- Move element
- Remove element

## Browser Support
IE7+, Chrome, Opera, Safari

## Setup
1. initialize the editor by ID<br>
`var editor = PEDIT.init('editor');`

2. Configure editor options (optional)<br>
`editor.offset = 2;`

3. Render children
`editor.render();`

## Add children (elements) dynamically
1. Create a new element and add it to the editor element<br>
`var element = document.createElement('div');`<br>
`editor.element.appendChild(element);`

2 Render children<br>
`editor.render();`<br>
or add child directly<br>
`var child = editor.addChild(element)`

