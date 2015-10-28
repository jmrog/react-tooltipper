React Tooltipper
===

<a href="https://www.npmjs.com/package/react-tooltipper" target="_blank">![](https://badge.fury.io/js/react-tooltipper.svg)</a> <a href="https://travis-ci.org/jmrog/react-tooltipper" target="_blank">![](https://travis-ci.org/jmrog/react-tooltipper.svg)</a>

<!---
<a href="http://jmrog.github.io/react-tooltipper/" target="_blank">![](http://jmrog.github.io/react-tooltipper/media/example.png)</a>

View the demo <a href="http://jmrog.github.io/react-tooltipper/" target="_blank">here</a>.
-->

**NOTE:** This is a fork of the react-joyride project created mostly for utilitarian reasons, and it is
in the very early stages of development. Things may break.

Create and trigger responsive beacons and tooltips for your ReactJS apps using this React mixin. It can
be used to show either clickable beacons that will open tooltips or simply the open tooltips themselves.
All beacons and tooltips are dynamically positioned so as to appear attached to their target elements,
and will reposition themselves on resizing, etc.

## Install

```
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

**This mixin can change state often, so you might want to use `React.addons.PureRenderMixin` in your
components as well.**

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

Set the options for your tooltips when the controller view component mounts.

```javascript
this.tooltipperSetOptions({
    completeCallback: () => {},
    doDebounceResize: true,
    scrollOffset: 90,
    showOverlay: false,
    scrollToTooltip: true
});
```

Define your tooltips whenever you'd like (prior to triggering):

```javascript
const tooltips = [{
    title: 'Tooltip Title',
    text: 'Some text for the tooltip.',
    selector: '.some-selector',
    position: 'bottom'
}, . . . ];
```
When you'd like, add your tooltip and trigger it:

```javascript
this.tooltipperSetTooltipData(tooltips[0]); // or whatever tooltip element you'd like
this.tooltipperTrigger();
```

```javascript
componentDidMount: function () {
    this.tooltipperSetTooltipData([{...}])]
}
```

## API

### this.tooltipperSetOptions(options)

Change the initial options during `componentWillMount`. All optional.

- `options` {object} - One or more of the options below.

**closeOnAnyClick** {boolean}: If true, close tooltips if the user clicks *anywhere*. If false, close
    tooltips only when the user clicks on the 'x' for the tooltip. Defaults to `false`.

**completeCallback** {function}: It will be called after a closes the tooltip. Defaults to `undefined`

**doDebounceResize** {boolean}: Do or do not debounce the resize event listenre. Defaults to `true`

**scrollOffset** {number}: The scrollTop offset used in `scrollToTooltip`. Defaults to `20`

**scrollToTooltip** {boolean}: Scroll the page to the next tooltip if needed. Defaults to `true`

**showOverlay** {boolean}: Display an overlay with holes above your tooltips. Defaults to `true`

**tooltipOffset** {number}: The tooltip offset from the target. Defaults to `30`

### this.tooltipperSetTooltipData(tooltipData)

Set up a tooltip to be shown on the next call to `this.tooltipperTrigger`.

- `tooltipData` {object} - Data describing the tooltip, as in the example below.

```javascript
this.tooltipperSetTooltipData([
	{
		title: "", //optional
		text: "...",
		selector: "...",
		position: "..."
	},
	...
]);
```

### this.tooltipperTrigger(autorun)

Call this method to trigger the tooltip defined with `this.tooltipperSetTooltipData`.

- `autorun` {boolean} - Optional; displays the tooltip in an already opened state (no beacon to click)

### this.tooltipperForceCalcPlacement()

Call this method to force a tooltip or beacon to recalculate its positioning. Typically, this happens
automatically, so you should only really need to call this method if (for example) an element is added
to or removed from the DOM and this should have an effect on the beacon's/tooltip's placement.


## tooltipData Syntax
There are 4 usable options but you can pass extra parameters.

- `title`: The title of the tooltip (optional)
- `text`: The tooltip's body (required)
- `selector`: The target DOM selector to which your tooltip will "attach" (required)
- `position`: Relative position of you beacon and tooltip. It can be one of these: `right`, `left`, `top`, `top-left`, `top-right`, `bottom`, `bottom-left`, `bottom-right` and `center`. This defaults to `top`.

Example:

```javascript
{
    title: 'First Tooltip',
    text: 'Start using the tooltipper',
    selector: '.first-tooltip',
    position: 'bottom-left',
    ...
    name: 'my-first-tooltip',
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

