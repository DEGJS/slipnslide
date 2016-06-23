import domUtils from "DEGJS/domUtils";
import indicators from "./indicators";
import navButtons from "./navButtons";
import swiper from "./swiper";
import { supportsCSSProp } from "./featureDetection";
import { debounce } from "./utils";

let slipnslide = function(element, options) {

	var containerEl,
		viewportEl,
		slideEls,
		indicatorsInst,
		navButtonsInst,
		currentSlideIndex = 0,
		maxSlideIndex = 0,
		visibleSlideCount,
		slideElWidth,
		useCSSTransforms,
		debouncedWindowResizeHandler,
		swiperInst = null,
		autoPlayIntervalId = null,
		autoPlayInited = false,
		settings,
		defaults = {
			autoPlay: true,
			autoPlaySpeed: 5000,
			pauseOnHover: true,
			infinite: true,
			containerCssClass: 'slipnslide',
			viewportCssClass: 'slipnslide__viewport',
			slidesContainerCssClass: 'slipnslide__slides',
			slideCssClass: 'slipnslide__slide',
			indicators: {
				enable: true,
				wrapperCssClass: 'slipnslide__indicators',
				indicatorCssClass: 'slipnslide__indicator',
				labelCssClass: 'is-vishidden',
				activeCssClass: 'slipnslide__indicator--active',
				indexAttribute: 'data-index'
			},
			navButtons: {
				enable: true,
				wrapperCssClass: 'slipnslide__navbuttons',
				buttonClass: 'slipnslide__navbutton',
				prevButtonClass: 'slipnslide__navbutton--previous',
				nextButtonClass: 'slipnslide__navbutton--next',
				labelCssClass: 'is-vishidden',
				prevButtonText: 'Previous',
				nextButtonText: 'Next',
				directionAttribute: 'data-direction'
			},
			slideSelector: 'div',
			slidesToShow: 1
		};

	function init() {
		settings = Object.assign({}, defaults, options);

		if (options && options.indicators) {
			settings.indicators = Object.assign({}, defaults.indicators, options.indicators);
		} else {
			settings.indicators = defaults.indicators;
		}
		if (options && options.navButtons) {
			settings.navButtons = Object.assign({}, defaults.navButtons, options.navButtons);
		} else {
			settings.navButtons = defaults.navButtons;
		}

		useCSSTransforms = supportsCSSProp('transform');

		createContainerEl();
		createViewportEl();
		prepareSlides();
		createIndicators();
		createNavButtons();
		enableSwiping();

		measure();

		debouncedWindowResizeHandler = debounce(onWindowResize, 50);
		window.addEventListener('resize', debouncedWindowResizeHandler);
		
		if(settings.autoPlay) {
			play();
		}
		
	}

	function configureAutoPlay() {
		if(autoPlayInited == false) {
			autoPlayInited = true;
			if(settings.pauseOnHover) {
				containerEl.addEventListener('mouseenter', pause);
				containerEl.addEventListener('mouseleave', play);
			}
		}
	}

	function play() {
		settings.autoPlay = true;
		configureAutoPlay();
		autoPlayIntervalId = setInterval(moveToNextSlide, settings.autoPlaySpeed);
	}

	function pause() {
		if(autoPlayIntervalId != null) {
			clearInterval(autoPlayIntervalId);
			autoPlayIntervalId = null;
		}
	}

	function onWindowResize() {
		measure();
	}

	function createContainerEl() {
		containerEl = document.createElement('div');
		domUtils.addCssClasses(containerEl, settings.containerCssClass);

		domUtils.wrapElements(element, containerEl);
	}

	function createViewportEl() {
		viewportEl = document.createElement('div');
		domUtils.addCssClasses(viewportEl, settings.viewportCssClass);

		domUtils.wrapElements(element, viewportEl);
	}

	function prepareSlides() {
		domUtils.addCssClasses(element, settings.slidesContainerCssClass);

		slideEls = Array.from(element.querySelectorAll(settings.slideSelector));

		slideEls.forEach(function(slideEl){
			domUtils.addCssClasses(slideEl, settings.slideCssClass);
		});
	}

	function createIndicators() {
		if(settings.indicators.enable) {
			settings.indicators.onIndicatorChange = onIndicatorChange;
			settings.indicators.activeIndicatorIndex = currentSlideIndex;
			settings.indicators.indicatorCount = slideEls.length;
			indicatorsInst = indicators(containerEl, settings.indicators);
		}
	}

	function createNavButtons() {
		if(settings.navButtons.enable) {
			settings.navButtons.onNavButtonChange = onNavButtonChange;
			settings.navButtons.maxSlideIndex = maxSlideIndex;
			navButtonsInst = navButtons(containerEl, settings.navButtons);
		}
	}

	function onIndicatorChange(index) {
		pause();
		moveToSlide(index);
	}

	function onNavButtonChange(direction) {
		pause();
		if (direction === 'previous') {
			moveToPreviousSlide();
		} else if (direction === 'next') {
			moveToNextSlide();
		}
	}

	function enableSwiping() {
        swiperInst = swiper(element);
        swiperInst.addListener('swipeleft', onSwipeLeft);

        swiperInst.addListener('swiperight', onSwipeRight);
    }

    function onSwipeLeft() {
    	pause();
    	moveToNextSlide();
    }

    function onSwipeRight() {
    	pause();
    	moveToPreviousSlide();
    }

    function moveToPreviousSlide() {
		moveToSlide(currentSlideIndex - 1);
	}

	function moveToNextSlide() {
		moveToSlide(currentSlideIndex + 1);
	}


	function moveToSlide(slideIndex) {
		if(slideIndex < 0) {
			if(settings.infinite) {
				currentSlideIndex = maxSlideIndex;
			} else {
				currentSlideIndex = 0;
			}
		}
		else if(slideIndex > maxSlideIndex) {
			if(settings.infinite) {
				currentSlideIndex = 0;
			} else {
				currentSlideIndex = maxSlideIndex;
			}
		}
		else
			currentSlideIndex = slideIndex;

		positionSlides();

		if(indicatorsInst) {
			indicatorsInst.setActiveIndicator(currentSlideIndex);
		}
		if(navButtonsInst) {
			navButtonsInst.setInactiveButton(currentSlideIndex);
		}
	}

	function measure() {
		if(slideEls.length > 0) {
			slideElWidth = viewportEl.clientWidth / getSlidesToShow();
			setSlideWidths();
			setSlidesContainerWidth();
			
			setMaxSlideIndex();

			if(currentSlideIndex != 0) {
				positionSlides();
			}
		}
	}

	function getSlidesToShow() {
		if (isFunction(settings.slidesToShow)) {
			return settings.slidesToShow();
		} else {
			return settings.slidesToShow;
		}
	}

	function setSlidesContainerWidth() {
		let slidesContainerElWidth = slideElWidth * slideEls.length;
		element.style.width = slidesContainerElWidth + "px";
	}

	function setSlideWidths() {
		slideEls.forEach(function(slideEl) {
			slideEl.style.width = slideElWidth.toString() + "px";
		});
	}

	function setMaxSlideIndex() {
		maxSlideIndex = slideEls.length - getSlidesToShow();
		
		if (currentSlideIndex > maxSlideIndex) {
			currentSlideIndex = maxSlideIndex;
		}
		if (navButtonsInst) {
			navButtonsInst.setMaxIndex(maxSlideIndex);
			navButtonsInst.setInactiveButton(currentSlideIndex);
		}
	}

	function positionSlides() {
		let position = -1 * currentSlideIndex * slideElWidth;

		if(useCSSTransforms)
			element.style.transform = "translate3d(" + position + "px, 0px, 0px)";
		else
			element.style.marginLeft = position + "px";
	};

	function isFunction(functionToCheck) {
		var getType = {};
		return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
	};

	function destroy() {
		window.removeEventListener('resize', debouncedWindowResizeHandler);
		
		if(settings.autoPlay) {
			pause();

			if(settings.pauseOnHover) {
				containerEl.removeEventListener('mouseenter', pause);
				containerEl.removeEventListener('mouseleave', play);
			}
		}

		if(swiperInst != null) {
			swiperInst.destroy();
		}

		domUtils.unwrapElements(containerEl);
		domUtils.unwrapElements(viewportEl);

		if (settings.indicators.enable) {
			indicatorsInst.destroy();
			indicatorsInst = null;
		}

		if (settings.navButtons.enable) {
			navButtonsInst.destroy();
			navButtonsInst = null;
		}

		domUtils.removeCssClasses(element, settings.slidesContainerCssClass);
		element.style.width = '';

		slideEls.forEach(function(item) {
			domUtils.removeCssClasses(item, settings.slideCssClass);
			item.style.width = '';
		});
	}

	init();

	return {
		destroy: destroy
	};

}

export default slipnslide;