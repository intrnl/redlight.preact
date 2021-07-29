import { h } from 'preact';
import { useRef } from 'preact/hooks';
import { apply as s } from '@intrnl/stylx';

import { usePress } from '~/lib/interactions';

import { Icon, IconUrl } from '~/src/components/icon';
import { Spacer } from '~/src/components/spacer';


let st = {
	container: {
		backgroundColor: 'var(--background-card)',
		display: 'flex',
		flexDirection: 'column',
	},

	header: {
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
		gap: 12,
		paddingInlineStart: 16,
		paddingInlineEnd: 16,
		paddingBlockStart: 12,
	},
	avatar: {
		backgroundColor: '#e5e5e5',
		height: 32,
		width: 32,
		borderRadius: '50%',
	},
	heading: {
		display: 'flex',
		flexDirection: 'column',
		flexGrow: '1',
	},
	title: {
		fontSize: '0.875rem',
		fontWeight: '700',
		lineHeight: '1.25rem',
	},
	subtitle: {
		color: 'var(--text-blurb)',
		fontSize: '0.875rem',
		lineHeight: '1.25rem',
	},

	body: {
		display: 'flex',
		flexDirection: 'column',
		paddingInlineStart: 16,
		paddingInlineEnd: 16,
		paddingBlockStart: 12,
	},
	content: {
		fontSize: '1rem',
		lineHeight: '1.5rem',
	},
	external: {
		fontSize: '0.875rem',
		lineHeight: '1.25rem',
		color: '#525252',
	},

	footer: {
		display: 'flex',
		flexDirection: 'row',
	},
	action: {
		color: '#525252',
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
		gap: 4,
		paddingInlineStart: 16,
		paddingInlineEnd: 16,
		paddingBlockStart: 12,
		paddingBlockEnd: 12,
	},
};

export function Post (props) {
	let { resource, currentSubreddit } = props;
	let { data } = resource.read();

	let showSubreddit = (currentSubreddit === resource.subreddit);

	return (
		<div className={s(st.container)}>
			<div className={s(st.header)}>
				<div className={s(st.avatar)}></div>
				<div className={s(st.heading)}>
					<span className={s(st.title)}>
						r/{data.subreddit}
					</span>
					<span className={s(st.subtitle)}>
						Posted by u/{data.author}
					</span>
				</div>
			</div>

			<div className={s(st.body)}>
				<p className={s(st.content)}>
					{data.title}
				</p>
				{data.post_hint === 'link' && (
					<span className={s(st.external)}>
						{data.domain}
					</span>
				)}
			</div>

			<div className={s(st.footer)}>
				<PostAction position='start'>
					<Icon src={IconUrl.ArrowUp} />
					{data.score}
				</PostAction>
				<PostAction>
					<Icon src={IconUrl.Conversation} />
					{data.num_comments}
				</PostAction>
				{data.post_hint === 'link' && (
					<PostAction>
						<Icon src={IconUrl.ExternalLink} />
					</PostAction>
				)}

				<Spacer />

				<PostAction position='end'>
					<Icon src={IconUrl.Share} />
				</PostAction>
			</div>
		</div>
	);
}

function PostAction (props) {
	let { children, onPress } = props;

	return (
		<button className={s(st.action)}>
			{children}
		</button>
	);
}
