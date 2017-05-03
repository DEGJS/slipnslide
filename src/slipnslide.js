/* */
let slipnslide = function(element, options) {
	var settings,
		containerEl,
		viewportEl,
		prevButtonEl,
		nextButtonEl,
		slideEls,
		slideElWidth,
		slideContainerElWidth,
		indicatorWrapperEl,
		indicatorInnerWrapperEl,
		indicatorItems,
		indicatorElWidth,
		currentIndex = 0,
		visibleSlideCount = 0,
		maxIndex = 0,
		useCSSTransforms = true,
		debouncedWindowResizeHandler,
		swiperInst = null,
		defaults = {
			itemSelector: 'li',
			containerClass: 'slipnslide',
			viewportClass: 'slipnslide__viewport',
			controlButtonClass: ['slipnslide__control-button'],
			prevButtonClass: ['slipnslide__prev-button'],
			nextButtonClass: ['slipnslide__next-button'],
			slidesClass: 'slipnslide__slides',
			slideClass: 'slipnslide__slide',
			showIndicators: true,
			photoIndicators: false,
			indicatorWrapperClass: 'slipnslide__indicator-wrapper',
			indicatorInnerWrapperClass: 'slipnslide__indicator-inner-wrapper',
			indicatorItemClass: 'slipnslide__indicator',
			indicatorActiveClass: 'is-active',
			currentIndex: 0
		};

	function init() {
		settings = extend(this, defaults, options);

		useCSSTransforms = testCSSTransformProp();

		createContainerEl();
		createViewportEl();
		createControls();
		prepareSlides();
		createIndicators();

		enableTouchEvents();

		updateControlButtons();

		debouncedWindowResizeHandler = debounce(onWindowResize, 100);
		window.addEventListener('resize', debouncedWindowResizeHandler);
		onWindowResize();
	}

	function createContainerEl() {
		containerEl = createElement('div', settings.containerClass);

		wrapElement(element, containerEl);
	}

	function createViewportEl() {
		viewportEl = createElement('div', settings.viewportClass);

		wrapElement(element, viewportEl);
	}

	function createControls() {

		prevButtonEl = createElement('button', settings.prevButtonClass.concat(settings.controlButtonClass));
		prevButtonEl.innerHTML = "Previous";
		containerEl.insertBefore(prevButtonEl, containerEl.firstChild);
		prevButtonEl.addEventListener('click', onPrevButtonElClick);

		nextButtonEl = createElement('button', settings.nextButtonClass.concat(settings.controlButtonClass));
		nextButtonEl.innerHTML = "Next";
		containerEl.appendChild(nextButtonEl);
		nextButtonEl.addEventListener('click', onNextButtonElClick);
	}

	function prepareSlides() {

		element.classList.add(settings.slidesClass);

		slideEls = Array.prototype.slice.call(element.querySelectorAll(settings.itemSelector), 0);

		slideEls.forEach(function(item) {
			item.classList.add(settings.slideClass);
		});
	}

	function createIndicators() {
		if ((settings.showIndicators) && (slideEls.length > 1)) {
			indicatorWrapperEl = createElement('div', settings.indicatorWrapperClass);
			indicatorInnerWrapperEl = createElement('ul', settings.indicatorInnerWrapperClass);
			slideEls.forEach(function(slide, index) {
				let el = createElement('li', settings.indicatorItemClass);
				if (index === settings.currentIndex) {
					el.classList.add(settings.indicatorActiveClass);
				}
				if (settings.photoIndicators) {
					let photoIndicator = `<img src="${slide.dataset.indicator}">`;
					el.innerHTML = photoIndicator;
				} else {
					el.innerHTML = index;
				}
				el.dataset.index = index;
				indicatorInnerWrapperEl.appendChild(el);
			});

			containerEl.appendChild(indicatorWrapperEl);
			indicatorWrapperEl.appendChild(indicatorInnerWrapperEl);
			indicatorWrapperEl = containerEl.querySelector('.' + settings.indicatorWrapperClass);

			indicatorItems = Array.prototype.slice.call(document.querySelectorAll('.' + settings.indicatorItemClass));
			indicatorItems.forEach(function(el, i) {
				el.addEventListener('click', onIndicatorClick);
			});
		}
	}

	function onIndicatorClick(e) {
		let clickedIndex = parseInt(e.currentTarget.dataset.index);
		if (clickedIndex !== settings.currentIndex) {
			move(clickedIndex - settings.currentIndex);
		}
	}

	function enableTouchEvents() {

        swiperInst = swiper(element);
        swiperInst.addEventListener('swipeleft', moveToNextSlide);

        swiperInst.addEventListener('swiperight', moveToPreviousSlide);
    }

	function measure() {
		if(slideEls.length > 0) {
			slideElWidth = getElementOuterWidth(slideEls[0]);

			if (element.classList.contains(settings.slidesClass)) {
				slideContainerElWidth = slideElWidth * slideEls.length;
				element.style.width = slideContainerElWidth + "px";
			}

			visibleSlideCount = Math.floor(viewportEl.clientWidth / slideElWidth);
			maxIndex = slideEls.length - visibleSlideCount;

			repositionSlides();

		}
		if (settings.photoIndicators) {
			indicatorElWidth = getElementOuterWidth(indicatorItems[0]);
		}
	}

	function moveToPreviousSlide() {
		move(-1);
	}

	function moveToNextSlide() {
		move(1);
	}

	function move(increment) {

		var destinationIndex = settings.currentIndex + increment;

		if(destinationIndex < 0)
			settings.currentIndex = 0;
		else if(destinationIndex >= maxIndex)
			settings.currentIndex = maxIndex;
		else
			settings.currentIndex += increment;


		var position = -1 * (settings.currentIndex * slideElWidth);

		positionSlides(position);

		if (settings.photoIndicators) {
			var	indicatorPosition = (-1 * (settings.currentIndex * indicatorElWidth)) + (indicatorElWidth * .5);
			var endOfIndicators = slideElWidth / indicatorElWidth;

			if (destinationIndex == 0) { indicatorPosition = 0; }
			else if (destinationIndex >= slideEls.length -endOfIndicators) {
				indicatorPosition = (-1 * (slideEls.length * indicatorElWidth) + (endOfIndicators * indicatorElWidth));
			}
			positionIndicators(indicatorPosition);
		}

		updateControlButtons();
		updateIndicators();
	}

	function positionSlides(position) {
		if(useCSSTransforms)
			setCSSTransform(element, "translate3d(" + position + "px, 0px, 0px)");
		else
			element.style.marginLeft = position + "px";
	}

	function positionIndicators(indicatorPosition) {
		if(useCSSTransforms)
			setCSSTransform(indicatorInnerWrapperEl, "translate3d(" + indicatorPosition + "px, 0px, 0px)");
		else
			indicatorWrapperEl.style.marginLeft = position + "px";
	}

	function repositionSlides() {
		if(settings.currentIndex != 0) {

			if(settings.currentIndex > maxIndex)
				settings.currentIndex = maxIndex;

			var position = -1 * settings.currentIndex * slideElWidth;
			positionSlides(position);
		}
	}

	function updateControlButtons() {
		updateControlButton(prevButtonEl, isAtStartOfSlides());
		updateControlButton(nextButtonEl, isAtEndOfSlides());
	}

	function updateIndicators() {
		if ((settings.showIndicators) && (slideEls.length > 1)) {
			let indicatorItems = Array.prototype.slice.call(indicatorWrapperEl.querySelectorAll('.' + settings.indicatorItemClass));
			indicatorItems.forEach(function(el, index) {
				if (index === settings.currentIndex) {
					if (!el.classList.contains(settings.indicatorActiveClass)) {
						el.classList.add(settings.indicatorActiveClass);
					}
				} else {
					el.classList.remove(settings.indicatorActiveClass);
				}
			});
		}
	}

	function updateControlButton(button, disable) {
		if(disable)
			button.setAttribute('disabled', 'disabled');
		else
			button.removeAttribute('disabled');
	}

	function isAtStartOfSlides() {
		return settings.currentIndex == 0;
	}

	function isAtEndOfSlides() {
		return settings.currentIndex == maxIndex;
	}

	function onPrevButtonElClick(e) {
		e.preventDefault();

		move(-1);
	}

	function onNextButtonElClick(e) {
		e.preventDefault();

		move(1);
	}

	function onWindowResize() {
		measure();
		updateControlButtons();
	}

	function destroy() {
		window.removeEventListener('resize', debouncedWindowResizeHandler);
		prevButtonEl.removeEventListener('click', onPrevButtonElClick);
		nextButtonEl.removeEventListener('click', onNextButtonElClick);

		if(swiperInst != null) {
			swiperInst.destroy();
		}

		unwrapElement(containerEl);
		unwrapElement(viewportEl);

		prevButtonEl.parentNode.removeChild(prevButtonEl);
		nextButtonEl.parentNode.removeChild(nextButtonEl);

		if (settings.showIndicators) {
			indicatorWrapperEl.parentNode.removeChild(indicatorWrapperEl);
		}

		element.classList.remove(settings.slidesClass);
		element.style.width = '100%';

		slideEls.forEach(function(item) {
			item.classList.remove(settings.slideClass);
		});

	}

	init();

	return {
		destroy: destroy
	}
};

let swiper = function(containerEl) {
	var listeners = [],
		minSwipeLength = 72,
		fingerCount,
		startX,
		startY,
		curX,
		curY;


    function init() {
        touchCancel();

        containerEl.addEventListener('touchstart', onTouchStart );
        containerEl.addEventListener('touchend', onTouchEnd );
        containerEl.addEventListener('touchmove', onTouchMove );
    };

    function addEventListener(eventType, listener) {
        if (typeof listeners[eventType] == "undefined"){
            listeners[eventType] = [];
        }

        listeners[eventType].push(listener);
    }

    function dispatchEvent(eventType) {
        if (listeners[eventType] instanceof Array){
            var evenTypeListeners = listeners[eventType];
            for (var i=0, len=evenTypeListeners.length; i < len; i++){
                evenTypeListeners[i].call(this);
            }
        }
    }

    function onTouchStart(event) {
        // disable the standard ability to select the touched object
        //event.preventDefault();
        // get the total number of fingers touching the screen
        fingerCount = event.touches.length;
        // since we're looking for a swipe (single finger) and not a gesture (multiple fingers),
        // check that only one finger was used
        if ( fingerCount == 1 ) {
            // get the coordinates of the touch
            startX = event.touches[0].pageX;
            startY = event.touches[0].pageY;
        } else {
            // more than one finger touched so cancel
            touchCancel(event);
        }
    }

    function onTouchMove(event) {
        //event.preventDefault();
        if ( event.touches.length == 1 ) {
            curX = event.touches[0].pageX;
            curY = event.touches[0].pageY;
        } else {
            touchCancel(event);
        }
    }

    function onTouchEnd(event) {
        //event.preventDefault();
        // check to see if more than one finger was used and that there is an ending coordinate
        if ( fingerCount == 1 && curX != 0 ) {
            // use the Distance Formula to determine the length of the swipe
            var swipeLength = Math.round(Math.sqrt(Math.pow(curX - startX,2) + Math.pow(curY - startY,2)));
            // if the user swiped more than the minimum length, perform the appropriate action
            if ( swipeLength >= minSwipeLength ) {
                var swipeDirection = determineSwipeDirection();
                dispatchEvent('swipe' + swipeDirection);
                touchCancel(event); // reset the variables
            } else {
                touchCancel(event);
            }
        } else {
            touchCancel(event);
        }
    }

    function touchCancel() {
        // reset the variables back to default values
        fingerCount = 0;
        startX = 0;
        startY = 0;
        curX = 0;
        curY = 0;
    }

    function caluculateAngle() {
        var X = startX-curX;
        var Y = curY-startY;
        var Z = Math.round(Math.sqrt(Math.pow(X,2)+Math.pow(Y,2))); //the distance - rounded - in pixels
        var r = Math.atan2(Y,X); //angle in radians (Cartesian system)
        var swipeAngle = Math.round(r*180/Math.PI); //angle in degrees
        if ( swipeAngle < 0 ) { swipeAngle =  360 - Math.abs(swipeAngle); }
        return swipeAngle;
    }

    function determineSwipeDirection() {
        var swipeAngle = caluculateAngle();

        if ( (swipeAngle <= 45) && (swipeAngle >= 0) ) {
            return 'left';
        } else if ( (swipeAngle <= 360) && (swipeAngle >= 315) ) {
            return 'left';
        } else if ( (swipeAngle >= 135) && (swipeAngle <= 225) ) {
            return 'right';
        } else if ( (swipeAngle > 45) && (swipeAngle < 135) ) {
            return 'down';
        } else {
            return 'up';
        }
    }

    function destroy() {
    	containerEl.removeEventListener('touchstart', onTouchStart );
        containerEl.removeEventListener('touchend', onTouchEnd );
        containerEl.removeEventListener('touchmove', onTouchMove );

        listeners = [];
    }

    init();

    return {
    	addEventListener: addEventListener,
    	destroy: destroy
    }
};

var extend = function(out) {
    out = out || {};
    for (var i = 1; i < arguments.length; i++) if (arguments[i]) for (var key in arguments[i]) arguments[i].hasOwnProperty(key) && (out[key] = arguments[i][key]);
    return out;
};

var createElement = function(tag, classNames) {
	var el = document.createElement(tag);

	if(Array.isArray(classNames) == false)
		classNames = [classNames];
	classNames.forEach(function(className) {
		el.classList.add(className);
	});

	return el;

};

var wrapElement = function(elToWrap, wrapperEl) {
	elToWrap.parentNode.insertBefore(wrapperEl, elToWrap);
	wrapperEl.appendChild(elToWrap);
};

var unwrapElement = function(el) {
	var fragment = document.createDocumentFragment();
	while(el.firstChild) {
	    fragment.appendChild(el.firstChild);
	}
	el.parentNode.replaceChild(fragment, el);
}

var getElementOuterWidth = function(el) {
	var elStyle = window.getComputedStyle(el);
	var elMargin = parseInt(elStyle.marginLeft) + parseInt(elStyle.marginRight);
	var elBorder = parseInt(elStyle.borderLeft) + parseInt(elStyle.borderRight);
	return el.clientWidth + (isNaN(elMargin) ? 0 : elMargin) + (isNaN(elBorder) ? 0 : elBorder);
};

var transformPropNames = ['transform', 'WebkitTransform', 'MozTransform', 'OTransform', 'msTransform'];

var testCSSTransformProp = function() {
	return !!testCSSProps(transformPropNames);
}

var testCSSProps = function( props ) {
	return getSupportedPropertyName(props) != null;
};

var getSupportedPropertyName = function(properties) {
    for (var i = 0; i < properties.length; i++) {
        if (typeof document.body.style[properties[i]] != "undefined") {
            return properties[i];
        }
    }
    return null;
}

var setCSSTransform = function(el, value) {
	var transformProperty = getSupportedPropertyName(transformPropNames);
	if(transformProperty)
		el.style[transformProperty] = value;
}

var debounce = function(fn, delay) {
	var timer = null;
	return function () {
	    var context = this, args = arguments;
	    clearTimeout(timer);
	    timer = setTimeout(function () {
	      fn.apply(context, args);
	    }, delay);
	};
}

export default slipnslide;
