const { Parser, mergeOutputs, Lexer } = require('..');
const { suite } = require('./wrapper');

console.log('> Running benchmarks');

suite('lexing', add => {
    const string = Array.from({ length: 1000 }, i => {
        const quoted = i % 11 == 0;
        const trailing = ' '.repeat(i % 4 + 1);
        return (quoted ? '"hey"' : 'hey') + trailing;
    }).join('');

    add('lexer.lex()', () => {
        const lexer = new Lexer(string).setQuotes(['"', '"']);
        lexer.lex();
    });
});

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
