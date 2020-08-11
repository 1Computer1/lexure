const Benchmark = require('benchmark');

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
    let n = 0;
    const suite = new Benchmark.Suite()
        .on('cycle', (event) => {
            console.log(`  ${String(event.target)}`);
        })
        .on('complete', function () {
            if (n > 1) {
                const name = this.filter('fastest').map('name');
                console.log(`  Fastest is ${bold(name)}`);
            }
        });

    fn((name, fn) => {
        n++;
        suite.add(name, fn);
    });

    return suite;
}

module.exports = { benchmarks };
