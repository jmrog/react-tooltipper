var React   = require('react/addons'),
    scroll  = require('scroll'),
    Beacon  = require('./Beacon'),
    Tooltip = require('./Tooltip');

var tooltipper = {
    browser: undefined, // useful for cross-browser styling
    initialized: false,
    listeners: {},
    mixin: null,
    options: {
        completeCallback: undefined,
        doDebounceResize: true,
        overridePosition: false,
        scrollToTooltip: true,
        scrollOffset: 20,
        showOverlay: true,
        tooltipOffset: 15,
        type: 'single'
    },
    tooltipData: {},

    /**
     * Returns the current browser
     * @returns {String}
     */
    getBrowser: function () {
        // Return cached result if available, else get result then cache it.
        if (this.browser) {
            return this.browser;
        }

        var isOpera = Boolean(window.opera) || navigator.userAgent.indexOf(' OPR/') >= 0;
        // Opera 8.0+ (UA detection to detect Blink/v8-powered Opera)
        var isFirefox = typeof InstallTrigger !== 'undefined';// Firefox 1.0+
        var isSafari = Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0;
        // At least Safari 3+: "[object HTMLElementConstructor]"
        var isChrome = Boolean(window.chrome) && !isOpera;// Chrome 1+
        var isIE = /*@cc_on!@*/false || Boolean(document.documentMode); // At least IE6

        return (this.browser =
            isOpera ? 'opera' :
                isFirefox ? 'firefox' :
                    isSafari ? 'safari' :
                        isChrome ? 'chrome' :
                            isIE ? 'ie' :
                                '');
    },

    /**
     * Get an element actual dimensions with margin
     * @param {String|DOMElement} el - Element node or selector
     * @returns {{height: number, width: number}}
     */
    getElementDimensions: function (el) {
        // Get the DOM Node if you pass in a string
        el = (typeof el === 'string') ? document.querySelector(el) : el;

        var styles = window.getComputedStyle(el),
            height = el.clientHeight + parseInt(styles.marginTop, 10) + parseInt(styles.marginBottom, 10),
            width  = el.clientWidth + parseInt(styles.marginLeft, 10) + parseInt(styles.marginRight, 10);

        return {
            height: height,
            width: width
        };
    },

    /**
     * Get the scrollTop position
     * @returns {number}
     */
    getScrollTop: function () {
        var state     = this.mixin.state,
            tooltipData      = tooltipper.tooltipData,
            position  = tooltipper.options.overridePosition || tooltipData.position,
            target    = document.querySelector(tooltipData.selector),
            targetTop = target.getBoundingClientRect().top + document.body.scrollTop,
            scrollTop = 0;

        if (/^top/.test(position)) {
            scrollTop = Math.floor(state._tooltipperYPos - tooltipper.options.scrollOffset);
        }
        else if (/^bottom|^left|^right/.test(position)) {
            scrollTop = Math.floor(targetTop - tooltipper.options.scrollOffset);
        }

        return scrollTop;
    },

    /**
     * Keydown event listener
     * @this Mixin
     * @param {Event} e - Keyboard event
     */
    keyboardNavigation: function (e) {
        var intKey = (window.Event) ? e.which : e.keyCode;

        if (this.state._tooltipperShowTooltip && intKey === 27) { // escape
            tooltipper.toggleTooltip(false, true);
        }
    },

    /**
     * Beacon click event listener
     * @this Mixin
     * @param {Event} e - Keyboard event
     */
    onClickBeacon: function (e) {
        e.preventDefault();
        tooltipper.toggleTooltip(true);
    },

    /**
     * Tooltip click event listener
     * @this Mixin
     * @param {Event} e - Keyboard event
     */
    onClickTooltip: function (e) {
        e.preventDefault();
        e.stopPropagation();

        var type = e.currentTarget.getAttribute('data-type');
        tooltipper.toggleTooltip(type !== 'close', type === 'close');
    },

    /**
     * Position absolute elements next to its target based on
     * the tooltip position and window size
     * @this this
     * @this Mixin
     */
    calcPlacement: function () {
        var mixin     = this.mixin || this,
            state     = mixin.state,
            tooltipData      = tooltipper.tooltipData,
            component = document.querySelector((state._tooltipperShowTooltip ? '.tooltipper-tooltip' : '.tooltipper-beacon')),
            position,
            body,
            target,
            placement = {
                x: -1000,
                y: -1000
            };

        if (Object.keys(tooltipData).length) {
            position = tooltipData.position;
            body = document.body.getBoundingClientRect();
            target = document.querySelector(tooltipData.selector).getBoundingClientRect();
            component = tooltipper.getElementDimensions((state._tooltipperShowTooltip ? '.tooltipper-tooltip' : '.tooltipper-beacon'));

            // Change the tooltip position if the tooltip won't fit in the window
            if (/^left/.test(position) && target.left - (component.width + tooltipper.options.tooltipOffset) < 0) {
                position = 'top';
            }
            else if (/^right/.test(position) && target.left + target.width + (component.width + tooltipper.options.tooltipOffset) > body.width) {
                position = 'bottom';
            }

            // Calculate x position
            if (/^left/.test(position)) {
                placement.x = target.left - (state._tooltipperShowTooltip ? component.width + tooltipper.options.tooltipOffset : component.width / 2);
            }
            else if (/^right/.test(position)) {
                placement.x = target.left + target.width - (state._tooltipperShowTooltip ? -tooltipper.options.tooltipOffset : component.width / 2);
            }
            else {
                placement.x = target.left + target.width / 2 - component.width / 2;
            }

            // Calculate y position
            if (/^top/.test(position)) {
                placement.y = (target.top - body.top) - (state._tooltipperShowTooltip ? component.height + tooltipper.options.tooltipOffset : component.height / 2);
            }
            else if (/^bottom/.test(position)) {
                placement.y = (target.top - body.top) + target.height - (state._tooltipperShowTooltip ? -tooltipper.options.tooltipOffset : component.height / 2);
            }
            else {
                placement.y = (target.top - body.top) + target.height / 2 - component.height / 2 + (state._tooltipperShowTooltip ? tooltipper.options.tooltipOffset : 0);
            }

            if (/^bottom|^top/.test(position)) {
                if (/left/.test(position)) {
                    placement.x = target.left - (state._tooltipperShowTooltip ? tooltipper.options.tooltipOffset : component.width / 2);
                }
                else if (/right/.test(position)) {
                    placement.x = target.left + target.width - (state._tooltipperShowTooltip ? component.width - tooltipper.options.tooltipOffset : component.width / 2);
                }
            }

            mixin.setState({
                _tooltipperXPos: tooltipper.preventWindowOverflow(Math.ceil(placement.x), 'x', component.width, component.height),
                _tooltipperYPos: tooltipper.preventWindowOverflow(Math.ceil(placement.y), 'y', component.width, component.height),
                tooltipperOverridePosition: tooltipData.position !== position ? position : false
            });
        }
    },

    /**
     * Prevent tooltip to render outside the window
     * @param {Number} value - The axis position
     * @param {String} axis - The Axis X or Y
     * @param {Number} elWidth - The target element width
     * @param {Number} elHeight - The target element height
     * @returns {Number}
     */
    preventWindowOverflow: function (value, axis, elWidth, elHeight) {
        var winWidth  = window.innerWidth,
            docHeight = document.body.offsetHeight,
            newValue  = value;

        if (axis === 'x') {
            if (value + elWidth >= winWidth) {
                newValue = winWidth - elWidth - 15;
            }
            else if (value < 0) {
                newValue = 15;
            }
        }
        else if (axis === 'y') {
            if (value + elHeight >= docHeight) {
                newValue = docHeight - elHeight - 15;
            }
            else if (value < 0) {
                newValue = 15;
            }
        }

        return newValue;
    },

    /**
     * Toggle Tooltip's visibility and deactivate Tooltipper if necessary
     * @param {Boolean} show Render the tooltip directly (true) or just the beacon (false)
     * @param {boolean} shouldDeactivate Deactivate Tooltipper if true (unmount and remove listeners)
     */
    toggleTooltip: function (show, shouldDeactivate) {
        this.mixin.setState({
            _tooltipperShouldBeActive: !shouldDeactivate,
            _tooltipperShowTooltip: show,
            _tooltipperXPos: -1000,
            _tooltipperYPos: -1000,
            _tooltipperTooltipSeenAndClosed: shouldDeactivate
        });
    }
};

/**
 * @constructor
 */
var Mixin = {
    getInitialState: function () {
        return {
            _tooltipperShouldBeActive: false,
            _tooltipperShowTooltip: false,
            _tooltipperXPos: -1000,
            _tooltipperYPos: -1000,
            _tooltipperTooltipSeenAndClosed: false
        };
    },

    componentDidMount: function () {
        var state = this.state;

        this._target = document.createElement('div');
        this._target.className = 'tooltipper';
        document.body.appendChild(this._target);

        if (Object.keys(tooltipper.tooltipData).length) {
            this._tooltipperRenderLayer();
        }

        tooltipper.mixin = this;

        if (!tooltipper.options.doDebounceResize) {
            tooltipper.listeners.resize = tooltipper.calcPlacement.bind(this);
        } else {
            tooltipper.listeners.resize = (function() {
                var timeoutId;
                return function() {
                    clearTimeout(timeoutId);
                    timeoutId = setTimeout(function() {
                        timeoutId = null;
                        tooltipper.calcPlacement.bind(tooltipper.mixin);
                    }, 200);
                }
            }());
        }
        window.addEventListener('resize', tooltipper.listeners.resize);

        tooltipper.listeners.keyboard = tooltipper.keyboardNavigation.bind(this);
        document.body.addEventListener('keydown', tooltipper.listeners.keyboard);
    },

    componentWillUnmount: function () {
        this._tooltipperUnrenderLayer();
        document.body.removeChild(this._target);

        window.removeEventListener('resize', tooltipper.listeners.resize);
        if (tooltipper.options.keyboardNavigation) {
            document.body.removeEventListener('keydown', tooltipper.listeners.keyboard);
        }
    },

    componentDidUpdate: function (prevProps, prevState) {
        var state = this.state,
            opt   = {
                newX: state._tooltipperXPos !== prevState._tooltipperXPos,
                newY: state._tooltipperYPos !== prevState._tooltipperYPos,
                hasTooltipData: Object.keys(tooltipper.tooltipData).length,
                toggleTooltip: true, // FIXME
                tooltipSeenAndClosed: state._tooltipperTooltipSeenAndClosed
            };

        if (opt.tooltipSeenAndClosed && state._tooltipperTooltipSeenAndClosed !== prevState._tooltipperTooltipSeenAndClosed) {
            if (typeof tooltipper.options.completeCallback === 'function') {
                tooltipper.options.completeCallback();
            }
            this._tooltipperUnrenderLayer();
        } else if (state._tooltipperShouldBeActive && (opt.toggleTooltip || opt.newX || opt.newY) && opt.hasTooltipData) {
            this._tooltipperRenderLayer();
        }
    },

    /**
     * Triggers (displays) a tooltip or its beacon
     * @param {boolean} [autorun]- Starts with the tooltip opened if true
     */
    tooltipperTrigger: function (autorun) {
        autorun = autorun || false;

        this.setState({
            _tooltipperShowTooltip: autorun,
            _tooltipperShouldBeActive: true,
            _tooltipperTooltipSeenAndClosed: false
        });
    },

    /**
     * Set the tooltip data to be used for the tooltip.
     *
     * @param {object} tooltipData A flat object specifying title, text, selector, and position.
     */
    tooltipperSetTooltipData: function(tooltipData) {
        // clone the data so that we don't accidentally mutate whatever was passed
        Object.keys(tooltipData).forEach(function(key) {
            tooltipper.tooltipData[key] = tooltipData[key];
        });
    },

    /**
     * Change the default options
     * @private
     */
    tooltipperSetOptions: function (opts) {
        Object.keys(tooltipper.options).forEach(function (o) {
            if (opts[o] !== undefined) {
                tooltipper.options[o] = opts[o];
            }
        })
    },

    _tooltipperRenderLayer: function () {
        var component = this._tooltipperRenderTooltip();
        if (component) {
            if (!tooltipper.initialized) {
                tooltipper.initialized = true;
                React.renderToString(component);
            }

            React.render(component, this._target, function () {
                tooltipper.calcPlacement();
                if (tooltipper.options.scrollToTooltip) {
                    scroll.top(document.body, tooltipper.getScrollTop());
                }
            }.bind(this));
        }
    },

    _tooltipperUnrenderLayer: function () {
        React.unmountComponentAtNode(this._target);
    },

    _tooltipperRenderTooltip: function () {
        var state       = this.state,
            component,
            tooltipData = !this.state._tooltipperTooltipSeenAndClosed && tooltipper.tooltipData,
            target      = tooltipData && tooltipData.selector ? document.querySelector(tooltipData.selector) : null,
            cssPosition = target ? target.style.position : null;

        if (target) {
            if (state._tooltipperShowTooltip) {
                component = React.createElement(Tooltip, {
                    animate: state._tooltipperXPos > -1,
                    browser: tooltipper.getBrowser(),
                    cssPosition: cssPosition,
                    overridePosition: tooltipper.options.overridePosition,
                    showOverlay: tooltipper.options.showOverlay,
                    tooltipData: tooltipData,
                    xPos: state._tooltipperXPos,
                    yPos: state._tooltipperYPos,
                    onClick: tooltipper.onClickTooltip.bind(this)
                });
            }
            else {
                component = React.createElement(Beacon, {
                    cssPosition: cssPosition,
                    xPos: state._tooltipperXPos,
                    yPos: state._tooltipperYPos,
                    onClick: tooltipper.onClickBeacon.bind(this)
                });
            }
        }

        return component;
    }
};

module.exports = Mixin;
