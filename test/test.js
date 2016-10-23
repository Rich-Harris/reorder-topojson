/*global require, describe, it */
const assert = require( 'assert' );
const { reorder } = require( '../dist/reorder-topojson.umd.js' );

function clone ( topology ) {
	return JSON.parse( JSON.stringify( topology ) );
}

describe( 'reorder-topojson', () => {
	it( 'reorders topojson with no arcs shared between objects', () => {
		const topology = {
			type: 'Topology',
			arcs: [
				[
					[ 0, 0 ],
					[ 10, 0 ],
					[ 10, 10 ],
					[ 0, 10 ],
					[ 0, 0 ]
				],
				[
					[ 20, 20 ],
					[ 30, 20 ],
					[ 30, 30 ],
					[ 20, 30 ],
					[ 20, 20 ]
				]
			],
			objects: {
				foo: {
					type: 'LineString',
					arcs: [ 1 ]
				},
				bar: {
					type: 'LineString',
					arcs: [ 0 ]
				}
			}
		};

		const original = clone( topology );

		reorder( topology, [ 'foo', 'bar' ]);

		assert.deepEqual( topology, {
			type: 'Topology',
			arcs: [
				original.arcs[1],
				original.arcs[0]
			],
			objects: {
				foo: {
					type: 'LineString',
					arcs: [ 0 ]
				},
				bar: {
					type: 'LineString',
					arcs: [ 1 ]
				}
			}
		});
	});

	it( 'reorders topojson with shared arcs', () => {
		const topology = {
			type: 'Topology',
			arcs: [
				[
					[ 10, 0 ],
					[ 10, 10 ],
					[ 0, 10 ]
				],
				[
					[ 0, 10 ],
					[ -10, 10 ],
					[ -10, -10 ],
					[ 10, -10 ],
					[ 0, 10 ]
				],
				[
					[ 0, 10 ],
					[ 0, 0 ],
					[ 10, 0 ]
				]
			],
			objects: {
				littleSquare: {
					type: 'Polygon',
					arcs: [ [ 0, 2 ] ]
				},
				bigSquare: {
					type: 'Polygon',
					arcs: [ [ 0, 1 ] ]
				}
			}
		};

		const original = clone( topology );

		reorder( topology, [ 'littleSquare', 'bigSquare' ]);

		assert.deepEqual( topology, {
			type: 'Topology',
			arcs: [
				original.arcs[0],
				original.arcs[2],
				original.arcs[1]
			],
			objects: {
				littleSquare: {
					type: 'Polygon',
					arcs: [ [ 0, 1 ] ]
				},
				bigSquare: {
					type: 'Polygon',
					arcs: [ [ 0, 2 ] ]
				}
			}
		});
	});
});
