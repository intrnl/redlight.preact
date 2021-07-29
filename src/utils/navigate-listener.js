import { useEffect } from 'preact/hooks';

import { useNavigate } from '~/lib/router';
import { useLatest } from '~/lib/use-latest';
import { addEvent, removeEvent } from '~/lib/interactions';


function isModifierKey (ev) {
	return ev.altKey || ev.ctrlKey || ev.metaKey || ev.shiftKey;
}

export function useNavigateListener (ref, options) {
	let opts = useLatest(options);
	let navigate = useNavigate();

	useEffect(() => {
		let node = ref.current;
		if (!node) return;

		let clickListener = (ev) => {
			let { disabled, to, replace } = opts.current;

			if (disabled) return;
			if (ev.defaultPrevented || isModifierKey(ev) || ev.button !== 0) return;

			ev.preventDefault();
			navigate(to, { replace });
		};

		let clickEvent = 'click';

		addEvent(node, clickEvent, clickListener);
		return () => removeEvent(node, clickEvent, clickListener);
	}, [ref, navigate]);
}
