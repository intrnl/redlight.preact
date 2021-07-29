import * as fs from 'fs/promises';
import * as esbuild from 'esbuild';
import { config } from '../esbuild.config.js';


try {
	await fs.rm(config.outdir, { recursive: true, force: true });

	let result = await esbuild.build({
		...config,

		minify: true,

		sourcemap: true,
		sourcesContent: false,
		sourceRoot: 'source:///',

		metafile: true,
	});
} catch (err) {
	console.error('Failed to build');
	console.error(err);
}
