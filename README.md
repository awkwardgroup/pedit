PEdit
=====
Edit multiple HTML elements (children) within a specific area (editor). Edit elements via the GUI or the object API. No libraries needed, just good old Vanilla JavaScript.

Developed by the team behind [www.printees.se](http://www.printees.se).

[View live demo](http://awkwardcloud.com/pedit/)

## Features
- Resize element (ratio driven)
- Move element
- Remove element

## Browser Support
Desktop and touch devices, IE8+, Chrome, Opera, Safari, Firefox

## Setup
(1) Install via NPM or download from GIT.

```bash
npm install pedit
```

Download: [https://github.com/awkwardgroup/pedit/archive/master.zip](https://github.com/awkwardgroup/pedit/archive/master.zip)

(2) Include the pedit javascipt.

```html
<script src="javascripts/pedit.min.js"></script>
```

(3) Include the stylesheet. You can edit the Sass file and compile it, or just edit the CSS. You will probably need to edit the style to fit your needs :)

```html
<link rel="stylesheet" type="text/css" href="stylesheets/style.css">
```

(4) Markup the HTML. Each child element of #editor will be editable after render.

```html
<div id="editor">
  <div></div>
</div>
````

(5) initialize the editor by ID

```js
var editor = PEDIT.init('editor');
```

(6) Configure editor options (optional)

```js
editor.offset = 2;
```

(7) Render child elements

```js
editor.render();
```

## Editor
With a reference to the editor you can access and update properties/options and run functions related to it. For example you can add a child dynamically:

```js
1. var element = document.createElement('div');
2. editor.element.appendChild(element);
3. editor.render();
```

You can also add a child directly without using `editor.render();` to get a reference to it:

```js
3. var child = editor.createChild(element);
```


### Editor Functions
**render()**<br>
Render all children in the editor.<br>
**createChild(element)**<br>
Render a single element in the editor.<br>
**calculateSize(pixels, horizontal)**<br>
Converts pixels to editor related percent value<br>
**getChild(ID)**<br>
Returns a child object based on ID.<br>
**clean()**<br>
Cleans the editor by deleting all children and reseting the trailing ID for children.

### Editor Properties
**editor.element**<br>
The editors HTML DOM element.<br>
**editor.width**<br>
The editors property width, defaults to elements offsetWidth.<br>
**editor.height**<br>
The editors property height, defaults to elements offsetHeight.<br>
**editor.offset**<br>
The editors inner offset, used when calculating sizes of elements within the editor.<br>
**editor.remove**<br>
Enable remove of children in the editor.<br>
**editor.resize**<br>
Enable resize of children in the editor.<br>
**editor.childMaxWidth**<br>
Set maximum width of children (in percent, only numeric value).<br>
**editor.childMaxHeight**<br>
Set maximum height of children (in percent, only numeric value).<br>
**editor.childMinWidth**<br>
Set minimum width of children (in percent, only numeric value).<br>
**editor.childMinHeight**<br>
Set minimum width of children (in percent, only numeric value).<br>
**editor.childTrailID**<br>
The ID that is used for children, incremented when a child is rendered.<br>
**editor.moveDoneFunction**<br>
Reference a function that runs when the movement of a child object is done. Takes the child object as a parameter.<br>
**editor.resizeDoneFunction**<br>
Reference a function that runs when the resizing of a child object is done. Takes the child object as a parameter.<br>
**editor.removeDoneFunction** (Only runs on GUI interaction)<br>
Reference a function that runs when the deleting of a child object is done. Takes the child object as a parameter.<br>
**editor.childRenderedFunction**<br>
Reference a function that runs when the redering of each child object is done. Takes the child object as a parameter.<br>
**editor.children**<br>
An object that holds all the children of the editor.

## Child
With a reference to the child object you can edit it via functions or access necessary properties. For example you can update the position of the child:

```js
child.updateElementPosition(20, 20);
```

Or you can access the childs size properties:

```js
var width = child.width();
var height = child.height();
```

### Child Functions
**updateElementPosition(offsetX, offsetY)**<br>
Updates the position of the element within the editor.<br>
**updateElementSize**<br>
Updates the size of the element within the editor.<br>

### Child Properties
The ID that represents the child object.<br>
**child.element**<br>
The childs HTML DOM element.<br>
**child.elementResize**<br>
The childs HTML DOM element for the resize button.<br>
**child.elementRemove**<br>
The childs HTML DOM element for the remove button.<br>
**child.editor**<br>
A reference to the child parent editor object.<br>
**child.locked**<br>
Locks the child and diabsles it from being interacted with.<br>
**child.width**<br>
The childs width in percent (related to the editor width).<br>
**child.height**<br>
The childs height in percent (related to the editor height).<br>
**child.offsetX**<br>
The childs X offset in percent (related to the editor width).<br>
**child.offsetY**<br>
The childs Y offset in percent (related to the editor height).

## Other functions
There are some other functions that can be accessed within the namespace.

**PEDIT.tools.isTouchDevice()**<br>
Detect if it's a touch device, returns true or false;<br>
**PEDIT.tools.getPageXY(event)**<br>
Get the current X and Y based on the event, returns an array.<br>
**PEDIT.tools.addTouchClass(className)**<br>
Adds a class to the body element if it's a touch device.<br>
**PEDIT.tools.toggleClass(element, className, remove)**<br>
Add or remove a class to an element.

## Misc
Please report issues with the script here on GitHub.
