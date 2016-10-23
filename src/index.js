export function reorder ( topology, order ) {
	const map = {};
	const arcs = [];

	let minArc;
	let maxArc;

	let acc = 0;

	function renumber ( arcIndex ) {
		const reversed = arcIndex < 0;
		if ( reversed ) arcIndex = ~arcIndex;

		if ( !( arcIndex in map ) ) {
			map[ arcIndex ] = acc;
			arcs[ acc ] = topology.arcs[ arcIndex ];

			acc += 1;
		}

		const newIndex = map[ arcIndex ];
		if ( newIndex < minArc ) minArc = newIndex;
		if ( newIndex > maxArc ) maxArc = newIndex;

		return reversed ? ~newIndex : newIndex;
	}

	function renumberString ( arcIndices ) {
		for ( let i = 0; i < arcIndices.length; i += 1 ) {
			arcIndices[i] = renumber( arcIndices[i] );
		}
	}

	const visitors = {
		GeometryCollection ( collection ) {
			collection.geometries.forEach( visit );
		},

		Point () {},
		MultiPoint () {},

		LineString ( geometry ) {
			renumberString( geometry.arcs );
		},

		MultiLineString ( geometry ) {
			for ( let i = 0; i < geometry.arcs.length; i += 1 ) {
				renumberString( geometry.arcs[i] );
			}
		},

		Polygon ( geometry ) {
			for ( let i = 0; i < geometry.arcs.length; i += 1 ) {
				renumberString( geometry.arcs[i] );
			}
		},

		MultiPolygon ( geometry ) {
			for ( let i = 0; i < geometry.arcs.length; i += 1 ) {
				const polygon = geometry.arcs[i];
				for ( let j = 0; j < polygon.length; j += 1 ) {
					renumberString( polygon[j] );
				}
			}
		}
	};

	function visit ( geometry ) {
		const visitor = visitors[ geometry.type ];
		if ( visitor ) visitor( geometry );
	}

	const ranges = {};

	order.forEach( name => {
		minArc = Infinity;
		maxArc = -Infinity;

		const geometry = topology.objects[ name ];
		visit( geometry );

		ranges[ name ] = [ minArc, maxArc ];
	});

	topology.arcs = arcs;
	return ranges;
}
