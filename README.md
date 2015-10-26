**NOT READY FOR PUBLIC CONSUMPTION.** A large portion of the readme below is inapplicable information
taken from an upstream source!

React Tooltipper
===

<a href="https://www.npmjs.com/package/react-tooltipper" target="_blank">![](https://badge.fury.io/js/react-tooltipper.svg)</a> <a href="https://travis-ci.org/jmrog/react-tooltipper" target="_blank">![](https://travis-ci.org/jmrog/react-tooltipper.svg)</a>
<a href="https://codeclimate.com/github/jmrog/react-tooltipper">![](https://codeclimate.com/github/jmrog/react-tooltipper/badges/gpa.svg)</a>

<a href="http://jmrog.github.io/react-tooltipper/" target="_blank">![](http://jmrog.github.io/react-tooltipper/media/example.png)</a>

View the demo <a href="http://jmrog.github.io/react-tooltipper/" target="_blank">here</a>.

## Install

```javascript
npm install --save react-tooltipper
```


```javascript
var react = require('react/addons');
var tooltipper = require('react-tooltipper').Mixin;

var App = React.createClass({
  mixins: [React.addons.PureRenderMixin, tooltipper],
  ...
});
```

**This mixin changes state often so you should use `React.addons.PureRenderMixin` in your components as well.**

#### Styles
 
If your are using **SCSS**:

```scss
@include 'react-tooltipper/lib/styles/react-tooltipper'

```

Or include this directly in your html:

```html
<link rel="stylesheet" href="react-tooltipper/lib/styles/react-tooltipper.css" type="text/css">
```


## Getting Started

Add steps to your tour after your component is mounted.

```javascript
	componentDidMount: function () {
		this.tooltipperAddSteps([{...}])]
	}
```

Start the tour with:

```javascript
this.tooltipperStart()
```

## API

### this.tooltipperSetOptions(options)

Change the initial options during `componentWillMount`. All optional

- `options` {object} - One or more of the options below.

**keyboardNavigation** {bool}: Toggle keyboard navigation (esc, space bar, return). Defaults to `true`

**locale** {object}: The strings used in the tooltip. Defaults to `{ back: 'Back', close: 'Close', last: 'Last', next: 'Next', skip: 'Skip' }`

**scrollOffset** {number}: The scrollTop offset used in `scrollToSteps`. Defaults to `20`

**scrollToSteps** {bool}: Scroll the page to the next step if needed. Defaults to `true`

**showBackButton** {bool}: Display a back button. Defaults to `true`

**showOverlay** {bool}: Display an overlay with holes above your steps. Defaults to `true`

**showSkipButton** {bool}: Display a link to skip the tour. It will trigger the `completeCallback` if it was defined. Defaults to `false`

**showStepsProgress** {bool}: Display the tour progress in the next button *e.g. 2/5*  in `guided` tours. Defaults to `false`

**tooltipOffset** {number}: The tooltip offset from the target. Defaults to `30`

**type** {string}: The type of your presentation. It can be `guided` (played sequencially with the Next button) or `single`. Defaults to `guided`

**completeCallback** {function}: It will be called after an user has completed all the steps or skipped the tour completely and passes the steps `{array}` and if the tour was skipped `{boolean}`. Defaults to `undefined`

**stepCallback** {function}: It will be called after each step and passes the completed step `{object}`. Defaults to `undefined`

Example:

```javascript
componentWillMount: function () {
	this.tooltipperSetOptions({
		locale: {
			back: 'Voltar',
			close: 'Fechar',
			last: 'Último',
			next: 'Próximo',
			skip: 'Pular'
		},
		showSkipButton: true,
		tooltipOffset: 10,
		...
		stepCallback: function(step) {
			console.log(step);
		},
		completeCallback: function(steps) {
			console.log(steps);
		}
	});
}
```

### this.tooltipperAddSteps(steps, [start])

Add steps to your tour. You can call this method multiple times even after the tour has started.

- `steps` {object|array} - Steps to add to the tour
- `start` {boolean} - Starts the tour right away (optional)

```javascript
this.tooltipperAddSteps([
	{
		title: "", //optional
		text: "...",
		selector: "...",
		position: "..."
	},
	...
]);
```

### this.tooltipperReplaceSteps(steps, [start])

Add steps to your tour. You can call this method multiple times even after the tour has started.

- `steps` {object|array} - Steps to replace
- `restart` {boolean} - Starts the new tour right away. Defaults to `true`

```javascript
this.tooltipperReplaceSteps([
	{
		title: "", //optional
		text: "...",
		selector: "...",
		position: "..."
	},
	...
], true);
```

### this.tooltipperStart(autorun)

Call this method to start the tour if it wasn't already started with `this.tooltipperAddSteps()`

- `autorun` {boolean} - Starts the tour with the first tooltip opened.

### this.tooltipperGetProgress()
Retrieve the current progress of your tour. The object returned looks like this:

```javascript
{
	index: 2,
	percentageComplete: 50,
	step: {
		title: "...",
		text: "...",
		selector: "...",
		position: "..."
	}
}}
```

## Step Syntax
There are 4 usable options but you can pass extra parameters.

- `title`: The title of the tooltip (optional)
- `text`: The tooltip's body (required)
- `selector`: The target DOM selector of your step (required)
- `position`: Relative position of you beacon and tooltip. It can be one of these: `right`, `left`, `top`, `top-left`, `top-right`, `bottom`, `bottom-left`, `bottom-right` and `center`. This defaults to `top`.

Example:

```javascript
{
    title: 'First Step',
    text: 'Start using the tooltipper',
    selector: '.first-step',
    position: 'bottom-left',
    ...
    name: 'my-first-step',
    parent: 'MyComponentName'
}
```

## SCSS Options

#### Basic

- `$tooltipper-color`: The base color. Defaults to `#f04`
- `$tooltipper-zindex`: Defaults to `1500`
- `$tooltipper-overlay-color`: Defaults to `rgba(#000, 0.5)`
- `$tooltipper-beacon-color`: Defaults to `$tooltipper-color`
- `$tooltipper-beacon-size`: Defaults to `36px`
- `$tooltipper-hole-border-radius`: Defaults to `4px`
- `$tooltipper-hole-shadow`: Defaults to `0 0 15px rgba(#000, 0.5)`

#### Tooltip

- `$tooltipper-tooltip-arrow-size`: You must use even numbers to avoid half-pixel inconsistencies. Defaults to `28px`
- `$tooltipper-tooltip-bg-color`: Defaults to `#fff`
- `$tooltipper-tooltip-border-radius`: Defaults to `8px`
- `$tooltipper-tooltip-color`: The header and text color. Defaults to `#555`
- `$tooltipper-tooltip-font-size`: Defaults to `16px`
- `$tooltipper-tooltip-padding`: Defaults to `20px`
- `$tooltipper-tooltip-shadow`: Defaults to `drop-shadow(2px 4px 4px rgba(#000, 0.5))`
- `$tooltipper-tooltip-width`: Sass list of Mobile / Tablet / Desktop sizes. Defaults to `(290px, 360px, 450px)`
- `$tooltipper-header-color`: Defaults to `$tooltipper-tooltip-header-color`
- `$tooltipper-header-font-size`: Defaults to `20px`
- `$tooltipper-header-border-color`: Defaults to `$tooltipper-color`
- `$tooltipper-header-border-width`: Defaults to `1px`
- `$tooltipper-button-bg-color`: Defaults to `$tooltipper-color`
- `$tooltipper-button-color`: Defaults to `#fff`
- `$tooltipper-button-border-radius`: Defaults to `4px`
- `$tooltipper-back-button-color`: Defaults to `$tooltipper-color`
- `$tooltipper-skip-button-color`: Defaults to `#ccc`

## License

Copyright © 2015 Jason Rogers - [MIT License](LICENSE)

---

Forked from [react-joyride](https://github.com/gilbarbara/react-joyride)

