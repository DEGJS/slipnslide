# Slipnslide
Don't use a carousel. If you have to, this one's not awful.

## Sample Usage
``` javascript
let slipnslideInst = slipnslide(element, slipnslideOptions);
```

## Settings
``` javascript
let slipnslideOptions = {
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
    indicatorItemClass: 'slipnslide__indicator',
    indiciatorActiveClass: 'is-active',
    currentIndex: '0'
}
```

## Revision History
* **1.0.0:** First commit.
* **1.0.1:** Fixed showIndicator bug on destroy.
* **1.1.1:** Added option to set starting slide with currentIndex.
* **1.1.2:** Updated demo CSS.
* **1.1.3:** Fixed bug with currentIndex.
* **1.2.3:** Added option to set photo indicators.