import { useRef } from 'preact/hooks';


export function useLatest (value) {
	let ref = useRef();
	ref.current = value;

	return ref;
}
