import svelte from 'rollup-plugin-svelte';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import livereload from 'rollup-plugin-livereload';
import { terser } from '@wwa/rollup-plugin-terser';
import sveltePreprocess from 'svelte-preprocess';
import typescript from '@rollup/plugin-typescript';
import css from 'rollup-plugin-css-only';
import { uglify } from 'rollup-plugin-uglify';
import gzipPlugin from 'rollup-plugin-gzip';
import { brotliCompress } from 'zlib';
import { promisify } from 'util';

const production = !process.env.ROLLUP_WATCH;
const brotliPromise = promisify(brotliCompress);

function serve() {
	let server;

	function toExit() {
		if (server) server.kill(0);
	}

	return {
		writeBundle() {
			if (server) return;
			// server = require('child_process').spawn('npm', ['run', 'start', '--', '--dev'], {
			// 	stdio: ['ignore', 'inherit', 'inherit'],
			// 	shell: true
			// });

			process.on('SIGTERM', toExit);
			process.on('exit', toExit);
		}
	};
}

export default {
	input: 'src/main.ts',
	output: {
		sourcemap: false,
		format: 'iife',
		name: 'openmeds',
		file: 'public/build/bundle.js',
		globals: {
            "App.svelte": 'App.svelte'
		}
	},
	plugins: [
		svelte({
			preprocess: sveltePreprocess({ sourceMap: false }),
			compilerOptions: {
				// enable run-time checks when not in production
				dev: !production
			}
		}),
		uglify(),
		// we'll extract any component CSS out into
		// a separate file - better for performance
		css({ output: 'bundle.css' }),
		// terser({
		// 	compress: {
		// 		unused: true,
		// 		collapse_vars:true
		// 	},
		// 	output: {
		// 		comments: false
		// 	},
		// 	sourceMap: true
		// }),

		// If you have external dependencies installed from
		// npm, you'll most likely need these plugins. In
		// some cases you'll need additional configuration -
		// consult the documentation for details:
		// https://github.com/rollup/plugins/tree/master/packages/commonjs
		resolve({
			browser: true,
			dedupe: ['svelte']
		}),
		commonjs(),
		typescript({
			inlineSources: false
		}),
		

		// In dev mode, call `npm run start` once
		// the bundle has been generated
		!production && serve(),

		// Watch the `public` directory and refresh the
		// browser on changes when not in production
		!production && livereload('public'),

		// If we're building for production (npm run build
		// instead of npm run dev), minify
		terser({
			output: {
			  comments: false,
			},
			compress: {
			  pure_getters: true,
			  unsafe: true,
			  unsafe_comps: true,
			  warnings: false,
			  sequences: true,
			  dead_code: true,
			  drop_debugger: true,
			  conditionals: true,
			  evaluate: true,
			  unused: true,
			  reduce_funcs: true,
			  reduce_vars: true,
			}
		}),
		gzipPlugin({
			customCompression: content => brotliPromise(Buffer.from(content)),
			fileName: '.br',
		  })
	],
};
