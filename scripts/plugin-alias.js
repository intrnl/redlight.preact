import * as path from 'path';


export function alias (paths) {
	let filter = new RegExp(`^(${Object.keys(paths).map(escape).join('|')})$`);
	let map = {};

	for (let [from, to] of Object.entries(paths)) {
		map[from] = path.resolve(to);
	}

	return {
		name: 'alias',
		setup (build) {
			build.onResolve({ filter }, (args) => ({ path: map[args.path] }));
		},
	};
}

function escape (str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
