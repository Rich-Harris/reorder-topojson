import buble from 'rollup-plugin-buble';

export default {
	entry: 'src/index.js',
	moduleName: 'reorderTopojson',
	targets: [
		{ dest: 'dist/reorder-topojson.umd.js', format: 'umd' },
		{ dest: 'dist/reorder-topojson.es.js', format: 'es' }
	],
	plugins: [
		buble()
	]
};
