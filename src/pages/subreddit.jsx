import { h, Fragment } from 'preact';
import { Suspense } from 'preact/compat';
import { useParams } from '~/lib/router';
import { useSearchParams } from '~/lib/use-search-params';

import * as api from '~/src/lib/api';
import { createMappedResource } from '~/src/utils/mapped-resource';
import { PostList } from '~/src/components/post-list';


let defaultParams = {
	sort: 'hot',
};

export default function SubredditPage () {
	return (
		<Suspense fallback={<SubredditViewFallback />}>
			<SubredditView />
		</Suspense>
	);
}

function SubredditView () {
	let { subreddit } = useParams();
	let [query, setQuery] = useSearchParams(defaultParams);

	let listing = api.feed.get(subreddit, query);

	return (
		<Fragment>
			<PostList resource={listing} />
		</Fragment>
	);
}

function SubredditViewFallback () {
	return (
		<div>SubredditViewFallback</div>
	);
}
