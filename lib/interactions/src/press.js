import { useEffect } from 'preact/hooks';
import { addEvent, removeEvent } from './utils';

import { useLatest } from '~/lib/use-latest';


export function usePress (ref, options) {
	let { disabled } = options;
	let opts = useLatest(options);

	useEffect(() => {
		let node = ref.current;
		if (!node || disabled) return;


		let pressTrigger = (event) => {
			let { onPress } = opts.current;

			onPress?.(event);
		};

		let pressCancel = (event) => {
			let { onPressCancel } = opts.current;

			onPressCancel?.(event);
		};

		let pressStart = (event) => {
			let { onPressChange, onPressStart } = opts.current;

			onPressChange?.(true);
			onPressStart?.(event);
		};

		let pressEnd = (event) => {
			let { onPressChange, onPressEnd } = opts.current;

			onPressChange?.(false);
			onPressEnd?.(event);
		};


		let modal = 0; // 0 = inactive | 1 = mouse  | 2 = keyboard
		let over = 0;  // 0 = outside  | 1 = inside

		/// Pointer
		let pointerDownListener = (event) => {
			if (modal === 0 && isClickActivator(event.button)) {
				modal = 1;
				over = 1;

				pressStart(event);
				return;
			}
		};

		let pointerUpListener = (event) => {
			if (modal === 1 && isClickActivator(event.button)) {
				if (event.target !== node) {
					modal = 0;
					over = 0;

					pressCancel(event);
					return;
				}

				let trigger = over;

				modal = 0;
				over = 0;

				pressEnd(event);
				if (trigger) pressTrigger(event);
				return;
			}
		};

		let pointerEnterListener = (event) => {
			if (modal === 1 && over === 0) {
				over = 1;

				pressStart(event);
				return;
			}
		};

		let pointerLeaveListener = (event) => {
			if (modal === 1 && over === 1) {
				over = 0;

				pressEnd(event);
				return;
			}
		};

		/// Keyboard
		let keyDownListener = (event) => {
			if (modal === 0 && isKeyActivator(event.key)) {
				modal = 2;

				pressStart(event);
				return;
			}

			if (modal === 2 && isKeyLeave(event.key)) {
				modal = 0;

				pressEnd(event);
				pressCancel(event);
				return;
			}
		};

		let keyUpListener = (event) => {
			if (modal === 2 && isKeyActivator(event.key)) {
				modal = 0;

				pressEnd(event);
				return;
			}
		};

		/// Keyboard + Virtual (assistive technologies, click method)
		let clickListener = (event) => {
			if (event.detail === 0) {
				pressTrigger(event);
				return;
			}
		};


		/// Events registration
		let pointerDownEvent = 'pointerdown';
		let pointerUpEvent = 'pointerup';
		let pointerEnterEvent = 'pointerenter';
		let pointerLeaveEvent = 'pointerleave';

		let keyDownEvent = 'keydown';
		let keyUpEvent = 'keyup';

		let clickEvent = 'click';

		addEvent(node, pointerDownEvent, pointerDownListener);
		addEvent(node, pointerUpEvent, pointerUpListener);
		addEvent(node, pointerEnterEvent, pointerEnterListener);
		addEvent(node, pointerLeaveEvent, pointerLeaveListener);

		addEvent(document, pointerUpEvent, pointerUpListener);

		addEvent(node, keyDownEvent, keyDownListener);
		addEvent(node, keyUpEvent, keyUpListener);

		addEvent(node, clickEvent, clickListener);

		return () => {
			removeEvent(node, pointerDownEvent, pointerDownListener);
			removeEvent(node, pointerUpEvent, pointerUpListener);
			removeEvent(node, pointerEnterEvent, pointerEnterListener);
			removeEvent(node, pointerLeaveEvent, pointerLeaveListener);

			removeEvent(document, pointerUpEvent, pointerUpListener);

			removeEvent(node, keyDownEvent, keyDownListener);
			removeEvent(node, keyUpEvent, keyUpListener);

			removeEvent(node, clickEvent, clickListener);
		};
	}, [ref, disabled]);
}

function isKeyActivator (key) {
	return key === 'Enter' || key === ' ';
}

function isKeyLeave (key) {
	return key === 'Tab';
}

function isClickActivator (button) {
	return button === 0;
}
