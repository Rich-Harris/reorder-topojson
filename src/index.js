export function reorder ( topology, order ) {
	const map = {};
	const arcs = [];

	let acc = 0;

	function renumber ( arcIndex ) {
		const reversed = arcIndex < 0;
		if ( reversed ) arcIndex = ~arcIndex;

		if ( !( arcIndex in map ) ) {
			map[ arcIndex ] = acc;
			arcs[ acc ] = topology.arcs[ arcIndex ];

			acc += 1;
		}

		return reversed ? ~map[ arcIndex ] : map[ arcIndex ];
	}

	function renumberString ( arcIndices ) {
		for ( let i = 0; i < arcIndices.length; i += 1 ) {
			arcIndices[i] = renumber( arcIndices[i] );
		}
	}

	const visitors = {
		GeometryCollection ( collection ) {
			collection.forEach( visit );
		},

		Point () {},
		MultiPoint () {},

		LineString ( arcIndices ) {
			renumberString( arcIndices );
		},

		MultiLineString ( strings ) {
			for ( let i = 0; i < strings.length; i += 1 ) {
				renumberString( strings[i] );
			}
		},

		Polygon ( rings ) {
			for ( let i = 0; i < rings.length; i += 1 ) {
				renumberString( rings[i] );
			}
		},

		MultiPolygon ( polygons ) {
			for ( let i = 0; i < polygons.length; i += 1 ) {
				visitors.Polygon( polygons[i] );
			}
		}
	};

	function visit ( geometry ) {
		const visitor = visitors[ geometry.type ];
		if ( visitor ) visitor( geometry.arcs );
	}

	order.forEach( nameOrObject => {
		const geometry = typeof nameOrObject === 'string' ? topology.objects[ nameOrObject ] : nameOrObject;
		visit( geometry );
	});

	topology.arcs = arcs;
}