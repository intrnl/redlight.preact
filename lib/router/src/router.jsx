import { h, Fragment, createContext, isValidElement, toChildArray } from 'preact';
import { useState, useContext, useCallback, useMemo, useLayoutEffect } from 'preact/hooks';
import { parsePath } from 'history';


let NavigatorContext = createContext(null);

let RouteContext = createContext({
	outlet: null,
	params: {},
	pathname: '',
	route: null,
});


export function useNavigatorContext () {
	return useContext(NavigatorContext);
}

export function useRouteContext () {
	return useContext(RouteContext);
}


export function useLocation () {
	let navigator = useNavigatorContext();
	return navigator.location;
}

export function useParams () {
	let route = useRouteContext();
	return route.params;
}

export function useHref (href) {
	let navigator = useNavigatorContext();
	let path = useResolvedPath(href);

	return navigator.history.createHref(path);
}

export function useResolvedPath (to) {
	let route = useRouteContext();
	let from = route.pathname;

	return useMemo(() => resolvePath(to, from), [to, from]);
}

export function useActivePath (to, opts = {}) {
	let { caseSensitive = false, end = false } = opts;

	let location = useLocation();
	let path = useResolvedPath(to);

	let curr = location.pathname;
	let next = path.pathname;

	if (!caseSensitive) {
		curr = curr.toLowerCase();
		next = next.toLowerCase();
	}

	let isActive = end
		? curr === next
		: curr.startsWith(next);

	return isActive;
}

export function useNavigate () {
	let navigator = useNavigatorContext();
	let route = useRouteContext();

	let pathname = route.pathname;
	let history = navigator.history;

	return useCallback((to, opts = {}) => {
		if (typeof to == 'number') {
			return history.go(to);
		}

		let path = resolvePath(to, pathname);
		let mode = opts.replace ? 'replace' : 'push';

		history[mode](path, opts.state);
	}, [history, pathname]);
}


export function Router (props) {
	let { children, history } = props;

	let [state, setState] = useState({
		action: history.action,
		location: history.location,
	});

	useLayoutEffect(() => (
		history.listen(setState)
	), [history]);


	return (
		<NavigatorContext.Provider value={{ ...state, history }}>
			{children}
		</NavigatorContext.Provider>
	);
}


export function Routes (props) {
	let { children, basename } = props;

	let routes = createRoutesFromChildren(children);

	let parent = useRouteContext();
	let location = useLocation();

	basename = basename ? joinPath(parent.pathname, basename) : parent.pathname;


	let matches = useMemo(() => (
		matchRoutes(routes, location, basename)
	), [routes, location, basename]);

	return matches.reduceRight((outlet, { route, pathname, params }) => (
		<RouteContext.Provider
			children={route.element}
			value={{
				outlet,
				params: { ...parent.params, ...params },
				pathname: joinPath(parent.pathname, pathname),
				route,
			}}
		/>
	), null);
}

export function Route (props) {
	let { element = <Outlet /> } = props;

	return element;
}

export function Outlet () {
	let route = useRouteContext();
	return route.outlet;
}


function createRoutesFromChildren (children) {
	let routes = [];

	for (let child of toChildArray(children)) {
		if (!isValidElement(child)) {
			continue;
		}

		if (child.type === Fragment) {
			routes.push(...createRoutesFromChildren(child.props.children));
			continue;
		}

		let route = {
			path: child.props.path || '/',
			caseSensitive: !!child.props.caseSensitive,
			element: child,
		};

		if (child.props.children) {
			let childRoutes = createRoutesFromChildren(child.props.children);

			if (childRoutes.length) {
				route.children = childRoutes;
			}
		}

		routes.push(route);
	}

	return routes;
}


function matchRoutes (routes, location, basename) {
	let pathname = location.pathname || '/';
	let matches = [];

	if (basename) {
		let base = basename.replace(/^\/*/, '/').replace(/\/+$/, '');

		if (pathname.startsWith(base)) {
			pathname = pathname === base ? '/' : pathname.slice(base.length);
		}
		else {
			return matches;
		}
	}

	let branches = flattenRoutes(routes);
	rankRouteBranches(branches);

	for (let branch of branches) {
		matches = matchRouteBranch(branch, pathname);
		if (matches.length) break;
	}

	return matches;
}

function matchRouteBranch (branch, pathname) {
	let [, routes] = branch;

	let matches = [];
	let matchedPathname = '/';
	let matchedParams = {};

	for (let i = 0; i < routes.length; i++) {
		let route = routes[i];
		let end = routes.length - 1 === i;

		let remainingPathname = matchedPathname === '/'
			? pathname
			: pathname.slice(matchedPathname.length) || '/';

		let matcher = compilePath(route.path, end, route.caseSensitive);
		let match = remainingPathname.match(matcher);

		if (!match) return [];

		matchedPathname = joinPath(matchedPathname, match[1]);
		matchedParams = { ...matchedParams, ...(match.groups || null) };

		matches.push({ route, pathname: matchedPathname, params: matchedParams });
	}

	return matches;
}

function flattenRoutes (
	routes,
	branches = [],
	parentPath = '',
	parentRoutes = [],
	parentIndexes = []
) {
	for (let route of routes) {
		let path = joinPath(parentPath, route.path);
		let routes = parentRoutes.concat(route);
		let indexes = parentIndexes.concat([]);

		if (route.children) {
			flattenRoutes(route.children, branches, path, routes, indexes);
		}

		branches.push([path, routes, indexes]);
	}

	return branches;
}

function rankRouteBranches (branches) {
	let isSplat = (s) => s === '*';
	let paramRE = /^:\w+$/;

	let pathScores = {};

	for (let [path] of branches) {
		let segments = path.split('/');
		let score = segments.length;

		if (segments.some(isSplat)) {
			score += -2;
		}

		for (let segment of segments) {
			if (isSplat(segment)) {
				continue;
			}

			if (paramRE.test(segment)) {
				score += 2;
			}
			else if (segment === '') {
				score += 1;
			}
			else {
				score += 10;
			}
		}

		pathScores[path] = score;
	}

	branches.sort((a, b) => {
		let [pathA] = a;
		let [pathB] = b;

		let scoreA = pathScores[pathA];
		let scoreB = pathScores[pathB];

		return scoreB - scoreA;
	});
}


export function trimPathTrailing (path) {
	return path.replace(/\/+$/, '');
}

export function normalizePath (path) {
	return path.replace(/\/\/+/g, '/');
}

export function splitPath (path) {
	return normalizePath(path).split('/');
}

export function joinPath (...paths) {
	return normalizePath(paths.join('/'));
}

export function resolvePath (to, from) {
	to = typeof to === 'string' ? parsePath(to) : to;
	let { pathname, search = '', hash = '' } = to;

	from = pathname[0] !== '/' && from || '/';

	let segments = splitPath(trimPathTrailing(from));
	let relative = splitPath(pathname);

	for (let segment of relative) {
		if (segment === '..') {
			if (segments.length > 1) segments.pop();
		}
		else if (segment !== '.') {
			segments.push(segment);
		}
	}

	pathname = segments.length > 1 ? joinPath(...segments) : '/';

	return { pathname, search, hash };
}


let pathCache = {};

export function compilePath (path, end, caseSensitive) {
	let key = path + '|' + end;

	if (pathCache[key]) {
		return pathCache[key];
	}

	let source = path
		.replace(/^\/*/, '/')
		.replace(/\/?\*?$/, '')
		.replace(/[\\.*+^$?{}|()[\]]/g, '\\$&')
		.replace(/:(\w+)/g, '(?<$1>[^\/]+)');

	let re = '^(' + source + ')';
	let flags = caseSensitive ? undefined : 'i';

	if (at(path, -1) === '*') {
		if (at(path, -2) === '/') {
			re += '(?:\\/(?<$>.+)|\\/?)';
    } else {
      re += '(?<$>.*)';
    }
	}
	else if (end) {
		re += '\\/?$';
	}

	return pathCache[key] = new RegExp(re, flags);
}

function at (target, n) {
	n = Math.trunc(n) || 0;

	if (n < 0) n += target.length;
	return target[n];
}
