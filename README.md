# reorder-topojson

Reorder the arcs in a topology.

## Why?

You have some TopoJSON. You need the arcs to be in a particular order, perhaps so you can load the topology progressively.


## How?

Install with `npm i reorder-topojson`, or grab it from [unpkg.com](https://unpkg.com/reorder-topojson). Then:

```js
import { reorder } from 'reorder-topojson';

const ranges = reorder( topology, [ 'foo', 'bar', 'baz' ]);

console.log( ranges );
// { foo: [ a, b ], bar: [ c, d ], baz: [ e, f ] }
```

The topology is modified in place. As a side-effect, unused arcs will be pruned. The returned `ranges` object contains, for each object, an array containing the first and last arcs used – helpful if you need to slice up the `arcs` array for progressive loading.


## License

MIT.
