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
    indicatorWrapperClass: 'slipnslide__indicator-wrapper',
    indicatorItemClass: 'slipnslide__indicator',
    indiciatorActiveClass: 'is-active'
}
```

## Revision History
* **1.0.0:** First commit.