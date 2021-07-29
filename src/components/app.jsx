import { h } from 'preact';
import { createHashHistory } from 'history';

import { Router } from '~/lib/router';
import { CacheProvider, Cache } from '~/lib/asset';

import { AppRouter } from '~/src/components/app-router';
import { MainLayout } from '~/src/components/main-layout';


let history = createHashHistory();
let cache = new Cache();

globalThis.__APP_CACHE = cache;

export function App () {
	return (
		<CacheProvider cache={cache}>
			<Router history={history}>
				<MainLayout>
					<AppRouter />
				</MainLayout>
			</Router>
		</CacheProvider>
	);
}
