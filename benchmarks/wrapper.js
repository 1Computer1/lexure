const Benchmark = require('benchmark');

function green(s) {
    return `\x1B[90;42;1m${s}\x1B[0m`;
}

function bold(s) {
    return `\x1B[1m${s}\x1B[0m`;
}

function benchmarks(fn) {
    const suites = [];
    fn((name, fn) => {
        suites.push([name, makeSuite(fn)]);
    });

    for (const [name, suite] of suites) {
        console.log(`${bold('>>>>')} ${name}`);
        suite.run();
        console.log('');
    }

    console.log('Benchmarks completed.');
}

function makeSuite(fn) {
    const suite = new Benchmark.Suite()
        .on('cycle', (event) => {
            console.log(`  ${String(event.target)}`);
        })
        .on('complete', function () {
            const name = this.filter('fastest').map('name');
            console.log(`${green(' OK ')} Fastest is ${bold(name)}`);
        });

    fn(suite.add.bind(suite));
    return suite;
}

module.exports = { benchmarks };
