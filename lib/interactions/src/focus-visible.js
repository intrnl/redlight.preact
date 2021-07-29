import { useState } from 'preact/hooks';

import { useFocus } from './focus';
import { useModality } from './modality';


export function useFocusVisible (ref) {
	let [focused, onFocusChange] = useState(false);
	let modality = useModality();

	useFocus(ref, { onFocusChange });

	return focused && modality === 'keyboard';
}
