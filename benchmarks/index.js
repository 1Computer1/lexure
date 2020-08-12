const { benchmarks } = require('./wrapper');
const {
    Lexer, Parser,
    mergeOutputs,
    longStrategy, longShortStrategy, pairingStrategy
} = require('..');

benchmarks(suite => {
    suite('lexing: lex with double quotes', add => {
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

    suite('parsing: parse with longStrategy', add => {
        const tokens = Array.from({ length: 1000 }, i => {
            const flag = i % 11 == 0;
            const option = !flag && i % 13 == 0;
            const v = i % 26 == 0;
            const s = flag ? '--hey' : option ? '--hey=' + (v ? 'there' : '') : 'hey';
            return { value: s, raw: s, trailing: ' ' };
        });

        add('parser.parse()', () => {
            const parser = new Parser(tokens).setUnorderedStrategy(longStrategy());
            parser.parse();
        });
    });

    suite('parsing: parse with longShortStrategy', add => {
        const tokens = Array.from({ length: 1000 }, i => {
            const flag = i % 11 == 0;
            const option = !flag && i % 13 == 0;
            const d = '-'.repeat(i % 2 + 1);
            const v = i % 26 == 0;
            const s = flag ? d + 'hey' : option ? d + 'hey=' + (v ? 'there' : '') : 'hey';
            return { value: s, raw: s, trailing: ' ' };
        });

        add('parser.parse()', () => {
            const parser = new Parser(tokens).setUnorderedStrategy(longShortStrategy());
            parser.parse();
        });
    });

    suite('parsing: parse with pairingStrategy', add => {
        const tokens = Array.from({ length: 1000 }, i => {
            const flag = i % 11 == 0;
            const option = !flag && i % 13 == 0;
            const v = i % 26 == 0;
            const s = flag ? 'flag!' : option ? 'opti:' + (v ? 'x' : '') : 'hey';
            return { value: s, raw: s, trailing: ' ' };
        });

        add('parser.parse()', () => {
            const parser = new Parser(tokens)
                .setUnorderedStrategy(pairingStrategy(
                    { flag: ['flag!'] },
                    { opti: ['opti:'] }
                ));

            parser.parse();
        });
    });

    suite('parsing: collect output with mutations vs merging', add => {
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
