import { h } from 'preact';
import { apply as s } from '@intrnl/stylx';

import { createMappedResource } from '~/src/utils/mapped-resource';
import { Post } from '~/src/components/post';


let st = {
	list: {
		display: 'flex',
		flexDirection: 'column',
		gap: 4,
	},
};

export function PostList (props) {
	let { resource, currentSubreddit } = props;
	let { data } = resource.read();

	return (
		<div className={s(st.list)}>
			{data.children.map((post) => (
				<Post
					key={post.data.id}
					resource={createMappedResource(post)}
					currentSubreddit={currentSubreddit}
				/>
			))}
		</div>
	);
}
