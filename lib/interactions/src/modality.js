import { useEffect, useState } from 'preact/hooks';
import { isMac, addEvent } from './utils';


let initialized = false;
let currentModal = null;
let hasEventBeforeFocus = false;
let hasBlurredWindowRecently = false;

let events = new EventTarget();
let eventsType = 'modality';


function handleKey (ev) {
	hasEventBeforeFocus = true;

	if (isValidKey(ev)) {
		dispatch(currentModal = 'keyboard');
	}
}

function handlePointer (ev) {
	currentModal = 'pointer';

	if (ev.type === 'pointerdown') {
		hasEventBeforeFocus = true;
		dispatch(currentModal);
	}
}

function handleClick (ev) {
	if (ev.detail === 0) {
		hasEventBeforeFocus = true;
		currentModal = 'virtual';
	}
}


function handleFocus (ev) {
	if (ev.target === window || ev.target === document) return;

	if (!hasEventBeforeFocus && !hasBlurredWindowRecently) {
		dispatch(currentModal = 'virtual');
	}

	hasEventBeforeFocus = false;
	hasBlurredWindowRecently = false;
}

function handleBlur (ev) {
	hasEventBeforeFocus = false;
	hasBlurredWindowRecently = true;
}

function isValidKey (ev) {
	return !(
		ev.metaKey ||
		(!isMac() && ev.altKey) ||
		ev.ctrlKey ||
		ev.type === 'keyup' && (ev.key === 'Control' || ev.key === 'Shift')
	);
}


function setup () {
	if (initialized) return;

	initialized = true;

	// Patch programmatic focus
	let prevFocus = HTMLElement.prototype.focus;
	HTMLElement.prototype.focus = function (...args) {
		hasEventBeforeFocus = false;
		prevFocus.apply(this, args);
	};

	// Attach event listeners
	let node = document;

	addEvent(node, 'keydown', handleKey, true);
	addEvent(node, 'keyup', handleKey, true);

	addEvent(node, 'click', handleClick, true);

	addEvent(node, 'focus', handleFocus, true);
	addEvent(node, 'blur', handleBlur, true);

	addEvent(node, 'pointerdown', handlePointer, true);
	addEvent(node, 'pointermove', handlePointer, true);
	addEvent(node, 'pointerup', handlePointer, true);
}

function dispatch (modality) {
	let event = new CustomEvent(eventsType, { detail: modality });
	events.dispatchEvent(event);
}

function subscribe (fn) {
	let listener = (ev) => fn(ev.detail);

	setup();
	events.addEventListener(eventsType, listener);
	return () => events.removeEventListener(eventsType, listener);
}

export function useModality () {
	let [modality, setModality] = useState(currentModal);

	useEffect(() => subscribe(setModality), []);
	return modality;
}
