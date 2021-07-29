import { useEffect } from 'preact/hooks';
import { addEvent, removeEvent } from './utils';

import { useLatest } from '~/lib/use-latest';


export function useFocus (ref, options) {
	let { disabled } = options;
	let opts = useLatest(options);

	useEffect(() => {
		let node = ref.current;
		if (!node || disabled) return;

		let focusEvent = 'focus';
		let blurEvent = 'blur';

		let focusListener = (event) => {
			let { onFocusChange, onFocus } = opts.current;

			onFocusChange?.(true);
			onFocus?.(event);
		};

		let blurListener = (event) => {
			let { onFocusChange, onBlur } = opts.current;

			onFocusChange?.(false);
			onBlur?.(event);
		};

		addEvent(node, focusEvent, focusListener);
		addEvent(node, blurEvent, blurListener);

		return () => {
			removeEvent(node, focusEvent, focusListener);
			removeEvent(node, blurEvent, blurListener);
		};
	}, [ref, disabled]);
}
