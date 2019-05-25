const Benchmark = require('benchmark');

const { createStringify } = require('../lib');

const suite = new Benchmark.Suite();

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

const res = [];

const percentageDiff = arr => {
  const use = arr.sort((a, b) => b - a);
  return ((use[0] - use[1]) / use[1]) * 100;
};

suite
  .add('native', () => JSON.stringify(obj))
  .add('tiny', () => tiny(obj))
  .on('cycle', event => {
    res.push(Math.floor(event.target.hz));
    console.log(String(event.target));
  })
  .on('complete', function() {
    const fastest = this.filter('fastest').map('name');
    console.log(`\n# ${fastest} is +${percentageDiff(res).toFixed(2)}% faster`);
    console.log('\n```\n');
  })
  .run();
