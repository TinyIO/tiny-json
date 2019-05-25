# tiny.json

[![Build Status](https://travis-ci.org/TinyIO/tiny-json.svg?branch=master)](https://travis-ci.org/TinyIO/tiny-json)
[![codebeat badge](https://codebeat.co/badges/88babe0c-4ecc-473f-b536-982051894988)](https://codebeat.co/projects/github-com-tinyio-tiny-json-master)
[![Coverage Status](https://coveralls.io/repos/github/TinyIO/tiny-json/badge.svg?branch=master)](https://coveralls.io/github/TinyIO/tiny-json?branch=master)
[![install size](https://packagephobia.now.sh/badge?p=@tiny.io/tiny.json)](https://packagephobia.now.sh/result?p=@tiny.io/tiny.json)
[![dependencies Status](https://david-dm.org/TinyIO/tiny-json/status.svg)](https://david-dm.org/TinyIO/tiny-json)

`tiny.json` is a `schema` base json stringify.
it's use schema to generated code. so it's significantly `faster` than `JSON.stringify()` with small payload.
and since it stringify with schema is also more secure.
## API
### createStringify(schema)
Build a `stringify()` function based on
[jsonschema](http://json-schema.org/). for now this implementation only support `'type'` & `'default'`.

#### `'string'`
  
If `value` is `null` or `undefined` the `'default'` whill be used.
otherwise `value.toJSON()` or `value.toString()` will be used.

Sample
```javascript
{
    type: 'string',
    default: '"hello"'
}
// notice the `default` need has `"` included, for now
```
#### `'boolean'`

If `value` is `null` or `undefined` the `'default'` whill be used.
otherwise, will use `!!(value)` to enforce to got `true|false` as result.

Sample
```javascript
{
    type: 'boolean',
    default: null
}
```

#### `'number'`
Result as `parseFloat(value)` if `isFinite` otherwise `default` whill be used.

Sample
```javascript
{
    type: 'number',
    default: 100
}
```

#### `'integer'`
Result as `parseInt(value)` if `isFinite` otherwise `default` whill be used.

Sample
```javascript
{
    type: 'integer',
    default: 200
}
```
#### `'object'`

use `properties` to declare `propertie`, all type can nested.

Sample
```javascript
// {"text":"hello", flag: false}
{
    type: 'object',
    properties: {
        text: { type: 'string'},
        flag: { type: 'boolean'}
    }
}
```
#### `'array'`

Sample
```javascript
// [1,2,3,4]
{
    type: 'array',
    items: {
        type: 'integer'
    }
}
// [{a:1},{a:2}]
{
    type: 'array',
    items: {
        type: 'object',
        properties: {
            a: { type: 'number'}
        }
    }
}
// [1, 2, false, "hello"]
{
    type: 'array'
}

```

**NOTE:** `tiny.json` won't perform any string escaping as is could be a performance impact. escaping may happend before stringify and stored as escaped.

you can useing `JSON.stringify` or `regex` as your need

Sample
```javascript
// with JSON.stringify.
JSON.stringify('hello "world"'); // hello \"world\"

// with regex.
'hello "world"'.replace(/\n|\r|\t|\"|\\/gm, char => '\\' + char) // hello \"world\"

```

## Benchmark
Checkout [benchmarks](#/benchmark/simple.js) code
``` bash
native x 1,720,071 ops/sec ±0.25% (91 runs sampled)
tiny x 60,489,145 ops/sec ±1.66% (89 runs sampled)

# tiny is +3416.67% faster
```
the `payload` and `schema` for this benchmark

```javascript
const obj = {
  hello: 'world',
  num: 20190522,
  flag: true
};

const tiny = createStringify({
  type: 'object',
  properties: {
    hello: {
      type: 'string'
    },
    num: {
      type: 'number'
    },
    flag: {
      type: 'boolean'
    }
  }
});
```