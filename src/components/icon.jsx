import { h } from 'preact';
import { apply as s } from '@intrnl/stylx';

import ArrowUpIcon from '~/src/icons/arrow-up.svg';
import CloseIcon from '~/src/icons/close.svg';
import ConversationIcon from '~/src/icons/conversation.svg';
import ExternalLinkIcon from '~/src/icons/external-link.svg';
import HomeIcon from '~/src/icons/home.svg';
import MenuIcon from '~/src/icons/menu.svg';
import SearchIcon from '~/src/icons/search.svg';
import ShareIcon from '~/src/icons/share.svg';


export let IconUrl = {
	ArrowUp: ArrowUpIcon,
	Close: CloseIcon,
	Conversation: ConversationIcon,
	ExternalLink: ExternalLinkIcon,
	Home: HomeIcon,
	Menu: MenuIcon,
	Search: SearchIcon,
	Share: ShareIcon,
};


let st = {
	base: {
		fill: 'currentColor',
		pointerEvents: 'none',
	},
};

export function Icon (props) {
	let { src, size = 20, xstyle } = props;

	let rem = (size / 16) + 'rem';

	let cn = s(st.base, xstyle);
	let style = { 'height': rem, width: rem };


	return (
		<svg className={cn} style={style}>
			<use href={src + '#icon'} />
		</svg>
	);
}
