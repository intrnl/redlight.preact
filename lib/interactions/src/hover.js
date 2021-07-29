import { useEffect } from 'preact/hooks';
import { addEvent, removeEvent } from './utils';

import { useLatest } from '~/lib/use-latest';


export function useHover (ref, options) {
	let { disabled } = options;
	let opts = useLatest(options);

	useEffect(() => {
		let node = ref.current;
		if (!node || disabled) return;

		let enterEvent = 'pointerenter';
		let leaveEvent = 'pointerleave';

		let enterListener = (event) => {
			let { onHoverChange, onHoverEnter } = opts.current;

			onHoverChange?.(true);
			onHoverEnter?.(event);
		};

		let leaveListener = (event) => {
			let { onHoverChange, onHoverLeave } = opts.current;

			onHoverChange?.(false);
			onHoverLeave?.(event);
		};

		addEvent(node, enterEvent, enterListener);
		addEvent(node, leaveEvent, leaveListener);

		return () => {
			removeEvent(node, enterEvent, enterListener);
			removeEvent(node, leaveEvent, leaveListener);
		};
	}, [ref, disabled]);
}
