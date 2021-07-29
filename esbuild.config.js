import { alias } from './scripts/plugin-alias.js';


/** @type {import('esbuild').BuildOptions} */
export let config = {
	bundle: true,
	splitting: true,
	format: 'esm',

	entryPoints: ['src/app.jsx'],
	publicPath: '/_assets',
	outdir: 'public/_assets/',

	loader: {
		'.svg': 'file',
	},

	plugins: [
		alias({ '~': '.' }),
	],
};
