import domUtils from "DEGJS/domUtils";

let navButtons = function(containerEl, settings) {

	let wrapperEl,
		navButtonEls = [],
		activeIndicatorIndex = settings.activeIndicatorIndex,
		maxIndex = settings.maxSlideIndex;

	function init() {
		createNavButtons();
	};

	function createNavButtons() {
		wrapperEl = document.createElement('div');
		domUtils.addCssClasses(wrapperEl, settings.wrapperCssClass);

		let buttonVals = [
			{
				direction: 'previous',
				class: settings.prevButtonClass,
				text: settings.prevButtonText
			},
			{
				direction: 'next',
				class: settings.nextButtonClass,
				text: settings.nextButtonText
			}
		];

		buttonVals.forEach(function(buttonVal) {
			let buttonEl = document.createElement('button');
			buttonEl.classList.add(settings.buttonClass);
			buttonEl.classList.add(buttonVal.class);
			buttonEl.setAttribute(settings.directionAttribute, buttonVal.direction);
			if (buttonVal.direction === 'previous') {
				buttonEl.setAttribute('disabled', true);
			}

			let labelEl = document.createElement('span');
			domUtils.addCssClasses(labelEl, settings.labelCssClass);
			labelEl.textContent = buttonVal.text;
			buttonEl.appendChild(labelEl);

			navButtonEls.push(buttonEl);
			wrapperEl.appendChild(buttonEl);
		});

		containerEl.appendChild(wrapperEl);
		wrapperEl.addEventListener('click', onClick);
	};

	function setMaxIndex(index) {
		maxIndex = index;
	};

	function setInactiveButton(index) {
		navButtonEls.forEach(function(el) {
			el.removeAttribute('disabled');
		});
		if (index === 0) {
			navButtonEls[0].setAttribute('disabled', true);
		} else if (index === maxIndex) {
			navButtonEls[1].setAttribute('disabled', true);
		}
	};

	function onClick(e) {
		e.preventDefault();
		settings.onNavButtonChange(e.target.getAttribute(settings.directionAttribute));
	};

	function destroy() {
		wrapperEl.removeEventListener('click', onClick);
		domUtils.removeElements(wrapperEl);
	}

	init();

	return {
		setMaxIndex: setMaxIndex,
		setInactiveButton: setInactiveButton,
		destroy: destroy
	}
}

export default navButtons;