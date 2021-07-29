import * as esbuild from 'esbuild';
import { config } from '../esbuild.config.js';


let server = await esbuild.serve({ servedir: 'public/', port: 3000 }, {
	...config,

	incremental: true,

	minify: true,

	sourcemap: true,
	sourcesContent: true,
	sourceRoot: 'source:///',
});

console.log(`Server started on ${server.host}:${server.port}`);
