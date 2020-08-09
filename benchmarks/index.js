const { Parser, mergeOutputs, Lexer, longShortStrategy, longStrategy } = require('..');
const { benchmarks } = require('./wrapper');

benchmarks(suite => {
    suite('lexing with quotes', add => {
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

    suite('parsing with flags', add => {
        const tokens = Array.from({ length: 1000 }, i => {
            const flag = i % 11 == 0;
            const option = !flag && i % 13 == 0;
            const s = flag ? '--hey' : option ? '--hey=there' : 'hey';
            return { value: s, raw: s, trailing: ' ' };
        });

        add('parser.parse()', () => {
            const parser = new Parser(tokens).setUnorderedStrategy(longStrategy());
            parser.parse();
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
});
