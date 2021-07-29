import { useEffect } from 'preact/hooks';

import { useLatest } from '~/lib/use-latest';


let observer = null;
let key = '__observeResize';

function getResizeObserver () {
	if (!observer) {
		observer = new ResizeObserver((entries) => {
			for (let entry of entries) {
				let { [key]: handleResize } = entry.target;
				handleResize?.(entry);
			}
		});
	}

	return observer;
}

export function useResize (ref, options) {
	let { disabled } = options;
	let opts = useLatest(options);

	let observer = getResizeObserver();

	useEffect(() => {
		let node = ref.current;
		if (!node || disabled) return;

		let resizeListener = (entry) => {
			let { boxSizing = 'border', onResize } = opts.current;

			let details = null;

			if (boxSizing === 'border') {
				details = entry.borderBoxSize[0] || entry.borderBoxSize;
			}
			else {
				details = entry.contentBoxSize[0] || entry.contentBoxSize;
			}

			onResize?.(details);
		};

		node[key] = resizeListener;
		observer.observe(node);

		return () => {
			observer.disconnect();
		};
	}, [ref, observer, disabled]);
}
