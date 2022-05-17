import svelte from 'rollup-plugin-svelte';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import livereload from 'rollup-plugin-livereload';
import { terser } from 'rollup-plugin-terser';
import css from 'rollup-plugin-css-only';

// const production = !process.env.ROLLUP_WATCH;
const isDev = Boolean(process.env.ROLLUP_WATCH);

function serve() {
	let server;

	function toExit() {
		if (server) server.kill(0);
	}

	return {
		writeBundle() {
			if (server) return;
			server = require('child_process').spawn('npm', ['run', 'start', '--', '--dev'], {
				stdio: ['ignore', 'inherit', 'inherit'],
				shell: true
			});

			process.on('SIGTERM', toExit);
			process.on('exit', toExit);
		}
	};
}

export default [

	{
		input: 'src/main.js',
		output: {
			sourcemap: true,
			format: 'iife',
			name: 'app',
			file: 'public/assets/js/bundle.js'
		},
		plugins: [
			svelte({
				compilerOptions: {
					hydratable: true,
					// css: css => {
					// 	css.write('public/assets/css/bundle.css')
					// }
				}
			}),
	
			css({ output: 'bundle.css' }),
	
			resolve({
				browser: true,
				dedupe: ['svelte']
			}),
			commonjs(),
	
			isDev && serve(),
	
			isDev && 
					livereload({
						watch: "public/App.js",
						delay: 200
					}),
	
			!isDev && terser()
		],
		watch: {
			clearScreen: false
		}
	},
	{
		// Server bundle
		// Este es el archivo re renderizara el servidor
		input: "src/App.svelte",
		output: {
			exports: "default",
			sourcemap: false,
			format: "cjs",
			name: "app",
			file: "public/App.js"
		},
		plugins: [
			svelte({
			compilerOptions: {
				generate: "ssr"
			}
			}),
			resolve(),
			commonjs(),
			!isDev && terser()
		]
	}
]

