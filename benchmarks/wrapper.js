const Benchmark = require('benchmark');

function suite(name, fn) {
    const suite = new Benchmark.Suite()
        .on('cycle', (event) => {
            console.log(String(event.target));
        })
        .on('complete', function () {
            console.log(`> Fastest is ${this.filter('fastest').map('name')}`);
        });

    fn(suite.add.bind(suite));
    console.log(`> Running benchmark - ${name}:`);
    suite.run();
}

module.exports = { suite };
