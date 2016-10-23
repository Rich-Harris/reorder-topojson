# reorder-topojson

Reorder the arcs in a topology.

## Why?

You have some TopoJSON. You need the arcs to be in a particular order, perhaps so you can load the topology progressively.


## How?

Install with `npm i reorder-topojson`, or grab it from [unpkg.com](https://unpkg.com/reorder-topojson). Then:

```js
import { reorder } from 'reorder-topojson';

// using names
reorder( topology, [
  'foo',
  'bar',
  'baz'
]);

// using obejcts (equivalent to previous example)
reorder( topology, [
  topology.objects.foo,
  topology.objects.bar,
  topology.objects.baz
]);
```

The topology is modified in place. As a side-effect, unused arcs will be pruned.


## License

MIT.
