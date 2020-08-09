const { Parser, mergeOutputs } = require('..');
const { suite } = require('./wrapper');

console.log('> Running benchmarks');

suite('collecting parser output via mutations vs merging', add => {    
    const tokens = Array.from(
        { length: 1000 },
        () => ({ value: 'hey', raw: 'hey', trailing: ' ' })
    );

    add('parser.parse()', () => {
        const parser = new Parser(tokens);
        parser.parse();
    });

    add('mergeOutputs(...parser)', () => {
        const parser = new Parser(tokens);
        mergeOutputs(...parser);
    });
});
