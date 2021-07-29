import { h } from 'preact';
import { apply as s } from '@intrnl/stylx';


let st = {
	spacer: {
		flexGrow: '1',
		flexShrink: '1',
	},
};

export function Spacer () {
	return (
		<div class={s(st.spacer)} />
	);
}
