import { h } from 'preact';
import { useState, useRef } from 'preact/hooks';
import { apply as s } from '@intrnl/stylx';

import { Spacer } from '~/src/components/spacer';
import { Icon, IconUrl } from '~/src/components/icon';
import { Modal } from '~/src/components/modal';

import { useFocusVisible, useHover, usePress } from '~/lib/interactions';


let st = {
	bar: {
		backgroundColor: 'var(--background-head)',
		display: 'flex',
		alignItems: 'center',
		height: 48,
		paddingInline: 6,
	},

	button: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		height: 36,
		width: 36,
		position: 'relative',
		borderRadius: 4,

		outlineStyle: 'solid',
		outlineWidth: 2,
		outlineOffset: 2,
		outlineColor: 'var(--accent)',
	},
	buttonHover: {
		backgroundColor: 'rgb(0 0 0 / 10%)',
	},
	buttonActive: {
		backgroundColor: 'rgb(0 0 0 / 20%)',
	},

	menu: {
		width: '100%',
		position: 'absolute',
		top: 0,
	},
	menuHeader: {
		display: 'flex',
		flexDirection: 'row-reverse',
		alignItems: 'center',
		height: 48,
		paddingInline: 6,
	},
	menuItem: {
	},
};

export function NavBar (props) {
	return (
		<nav class={s(st.bar)}>
			<div id='navbar-outlet' />
			<Spacer />
			<NavMenuButton />
		</nav>
	);
}

export function NavButton (props) {
	let { children, title, active, onPress } = props;

	let [hovered, onHoverChange] = useState(false);
	let [pressed, onPressChange] = useState(false);

	let ref = useRef();
	let focused = useFocusVisible(ref);
	useHover(ref, { onHoverChange });
	usePress(ref, { onPressChange, onPress });

	let cn = s(
		st.button,
		focused && st.buttonFocus,
		hovered && st.buttonHover,
		(pressed || active) && st.buttonActive,
	);


	return (
		<button ref={ref} class={cn} title={title}>
			{children}
		</button>
	);
}

function NavMenuButton () {
	let [open, setOpen] = useState(false);
	let toggleOpen = () => setOpen(!open);

	return (
		<div>
			<NavButton title='Open menu' onPress={toggleOpen}>
				<Icon src={IconUrl.Menu} />
			</NavButton>
			<NavMenu open={open} onClose={toggleOpen} />
		</div>
	);
}

function NavMenu (props) {
	let { open, onClose } = props;

	return (
		<Modal
			class={s(st.menu)}
			open={open}
			onCancel={onClose}
		>
			<div class={s(st.menuHeader)}>
				<NavButton title='Close menu' onPress={onClose}>
					<Icon src={IconUrl.Close} />
				</NavButton>
			</div>

		</Modal>
	);
}
