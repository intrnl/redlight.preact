import { useCallback } from 'preact/hooks';


export function useMergeRefs (...refs) {
	return useCallback((node) => {
		for (let ref of refs) {
			if (!ref) {
				continue;
			}

			if (typeof ref === 'function') {
				ref(node);
			}

			if (typeof ref === 'object') {
				ref.current = node;
			}
		}
	}, refs);
}
