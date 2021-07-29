import { h } from 'preact';
import { Suspense, lazy } from 'preact/compat';
import { Routes, Route } from '~/lib/router';

import { Redirect } from '~/src/components/redirect';


let SubredditPage = lazy(() => import('~/src/pages/subreddit'));

export function AppRouter () {
	return (
		<Suspense fallback={<div>Fallback</div>}>
			<Routes>
				<Route path='/' element={<Redirect to='/r/popular' />} />
				<Route path='/r/:subreddit/*'>
					<Route path='/' element={<SubredditPage />} />
				</Route>
			</Routes>
		</Suspense>
	);
}
