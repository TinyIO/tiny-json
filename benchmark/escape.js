const Benchmark = require('benchmark');

const suite = new Benchmark.Suite();

const data = 'hello "world"';

const res = [];

const percentageDiff = arr => {
  const use = arr.sort((a, b) => b - a);
  return ((use[0] - use[1]) / use[1]) * 100;
};

suite
  .add('native', () => JSON.stringify(data))
  .add('tiny', () => data.replace(/\n|\r|\t|\"|\\/gm, char => '\\' + char))
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
