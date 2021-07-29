import { h } from 'preact';

import { NavBar } from '~/src/components/navbar';


export function MainLayout (props) {
	return (
		<div>
			<NavBar />
			<div>
				{props.children}
			</div>
		</div>
	);
}
