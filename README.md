PEdit
=====
Edit multiple HTML elements (children) within a specific area (editor). It's super easy to edit elements via a GUI or the object API. No libraries needed, just good old JavaScript.

Developed by the team behind www.printees.se.

[View live demo](http://awkwardcloud.com/pedit/)

## Features
- Resize element (ratio driven)
- Move element
- Remove element

## Browser Support
Desktop and touch devices, IE8+, Chrome, Opera, Safari, Firefox

## Setup
1. Include the pedit javascipt and css.<br>
`<script src="javascripts/pedit.min.js"></script>`

2. Include the stylesheet. You can edit the Sass file and compile it, or just edit the CSS. You will probably need to edit the style to fit your needs :)<br>
`<link rel="stylesheet" type="text/css" href="stylesheets/style.css">`

3. Markup the HTML. Each child element of #editor will be editable after render.<br>
`<div id="editor">`<br>
`	<div></div>`<br>
`</div>`

4. initialize the editor by ID<br>
`var editor = PEDIT.init('editor');`

5. Configure editor options (optional)<br>
`editor.offset = 2;`

6. Render child elements<br>
`editor.render();`

## Add child elements dynamically
1. Create a new DOM element and add it to the editor element<br>
`var element = document.createElement('div');`<br>
`editor.element.appendChild(element);`

2. Render editor to create new child objects<br>
`editor.render();`<br>
_or create each child directly_<br>
`var child = editor.createChild(element)`

## Edit child element via JavaScript
With a reference to the child object you can edit it via JavaScript:<br>
`child.updateElementPosition(x, y)`<br>
_or_<br>
`child.updateElementSize(widthPercent, heightPercent)`

You can also access the child properties like offsets, size, etc.

## Functions
These are the functions that can be used for each editor.

render()<br>
createChild(element)<br>
**calculateSize(pixels, horizontal)**<br>
Converts pixels to editor related percent value<br>
**getChild(ID)**<br>
Returns a child object based on ID.<br>
**clean()**<br>
Cleans the editor by deleting all children and reseting the trailing ID for children.

## Options
These are the properties that can be set for each editor.

editor.width<br>
editor.height<br>
editor.offset<br>
editor.remove<br>
editor.resize<br>
editor.percent<br>
editor.updateChildMaxSize<br>
editor.childMaxWidth<br>
editor.childMaxHeight<br>
editor.childMinWidth<br>
editor.childMinHeight<br>
editor.childTrailID<br>
editor.moveDoneFunction<br>
editor.resizeDoneFunction<br>
editor.removeDoneFunction (Only runs on GUI interaction)<br>
editor.childRenderedFunction

## Misc
Please report issues with the script here on GitHub.
