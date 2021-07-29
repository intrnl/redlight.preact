import { useEffect } from 'preact/hooks';
import { addEvent, removeEvent } from './utils';

import { useLatest } from '~/lib/use-latest';


export function useFocusWithin (ref, options) {
	let { disabled } = options;
	let opts = useLatest(options);

	useEffect(() => {
		let node = ref.current;
		if (!node || disabled) return;

		let focusInEvent = 'focusin';
		let focusOutEvent = 'focusout';

		let focusInListener = (event) => {
			let { onFocusWithinChange, onFocusWithin } = opts.current;

			onFocusWithinChange?.(true);
			onFocusWithin?.(event);
		};

		let focusOutListener = (event) => {
			let { onFocusWithinChange, onBlurWithin } = opts.current;

			onFocusWithinChange?.(false);
			onBlurWithin?.(event);
		};

		addEvent(node, focusInEvent, focusInListener);
		addEvent(node, focusOutEvent, focusOutListener);

		return () => {
			removeEvent(node, focusInEvent, focusInListener);
			removeEvent(node, focusOutEvent, focusOutListener);
		};
	}, [ref, disabled]);
}
