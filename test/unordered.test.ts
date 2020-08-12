import {
    noStrategy, longStrategy, longShortStrategy, prefixedStrategy, matchingStrategy,
    mapKeys, renameKeys
} from '../src/';

describe('noStrategy', () => {
    it('should be false and null', () => {
        const s = noStrategy();
        expect(s.matchFlag('foo')).toEqual(null);
        expect(s.matchOption('bar')).toEqual(null);
        expect(s.matchCompactOption('baz')).toEqual(null);
    });
});

describe('longStrategy', () => {
    it('should parse a flag exclusively', () => {
        const s = longStrategy();
        const x = '--foo';
        expect(s.matchFlag(x)).toEqual('foo');
        expect(s.matchOption(x)).toEqual(null);
        expect(s.matchCompactOption(x)).toEqual(null);
    });

    it('should parse an option exclusively', () => {
        const s = longStrategy();
        const x = '--foo=';
        expect(s.matchFlag(x)).toEqual(null);
        expect(s.matchOption(x)).toEqual('foo');
        expect(s.matchCompactOption(x)).toEqual(null);
    });

    it('should parse a compact option exclusively', () => {
        const s = longStrategy();
        const x = '--foo=x';
        expect(s.matchFlag(x)).toEqual(null);
        expect(s.matchOption(x)).toEqual(null);
        expect(s.matchCompactOption(x)).toEqual(['foo', 'x']);
    });
});

describe('longShortStrategy', () => {
    it('should parse a flag exclusively', () => {
        const s = longShortStrategy();
        const x = '--foo';
        expect(s.matchFlag(x)).toEqual('foo');
        expect(s.matchOption(x)).toEqual(null);
        expect(s.matchCompactOption(x)).toEqual(null);
    });

    it('should parse a short flag exclusively', () => {
        const s = longShortStrategy();
        const x = '-f';
        expect(s.matchFlag(x)).toEqual('f');
        expect(s.matchOption(x)).toEqual(null);
        expect(s.matchCompactOption(x)).toEqual(null);
    });

    it('should parse an option exclusively', () => {
        const s = longShortStrategy();
        const x = '--foo=';
        expect(s.matchFlag(x)).toEqual(null);
        expect(s.matchOption(x)).toEqual('foo');
        expect(s.matchCompactOption(x)).toEqual(null);
    });

    it('should parse a short option exclusively', () => {
        const s = longShortStrategy();
        const x = '-f=';
        expect(s.matchFlag(x)).toEqual(null);
        expect(s.matchOption(x)).toEqual('f');
        expect(s.matchCompactOption(x)).toEqual(null);
    });

    it('should parse a compact option exclusively', () => {
        const s = longShortStrategy();
        const x = '--foo=x';
        expect(s.matchFlag(x)).toEqual(null);
        expect(s.matchOption(x)).toEqual(null);
        expect(s.matchCompactOption(x)).toEqual(['foo', 'x']);
    });

    it('should parse a short compact option exclusively', () => {
        const s = longShortStrategy();
        const x = '-f=3';
        expect(s.matchFlag(x)).toEqual(null);
        expect(s.matchOption(x)).toEqual(null);
        expect(s.matchCompactOption(x)).toEqual(['f', '3']);
    });
});

describe('prefixedStrategy', () => {
    it('should parse a flag exclusively', () => {
        const s = prefixedStrategy(['--'], ['=']);
        const x = '--foo';
        expect(s.matchFlag(x)).toEqual('foo');
        expect(s.matchOption(x)).toEqual(null);
        expect(s.matchCompactOption(x)).toEqual(null);
    });

    it('should parse an option exclusively', () => {
        const s = prefixedStrategy(['--'], ['=']);
        const x = '--foo=';
        expect(s.matchFlag(x)).toEqual(null);
        expect(s.matchOption(x)).toEqual('foo');
        expect(s.matchCompactOption(x)).toEqual(null);
    });

    it('should parse a compact option exclusively', () => {
        const s = prefixedStrategy(['--'], ['=']);
        const x = '--foo=x';
        expect(s.matchFlag(x)).toEqual(null);
        expect(s.matchOption(x)).toEqual(null);
        expect(s.matchCompactOption(x)).toEqual(['foo', 'x']);
    });

    it('with multiple symbols, should parse a flag', () => {
        const s = prefixedStrategy(['--', '-', '/'], ['=', ':']);
        const x = '-foo';
        expect(s.matchFlag(x)).toEqual('foo');
        expect(s.matchOption(x)).toEqual(null);
        expect(s.matchCompactOption(x)).toEqual(null);
    });

    it('with multiple symbols, should parse an option', () => {
        const s = prefixedStrategy(['--', '-', '/'], ['=', ':']);
        const x = '/foo:';
        expect(s.matchFlag(x)).toEqual(null);
        expect(s.matchOption(x)).toEqual('foo');
        expect(s.matchCompactOption(x)).toEqual(null);
    });

    it('with multiple symbols, should parse a compact option', () => {
        const s = prefixedStrategy(['--', '-', '/'], ['=', ':']);
        const x = '-foo=x';
        expect(s.matchFlag(x)).toEqual(null);
        expect(s.matchOption(x)).toEqual(null);
        expect(s.matchCompactOption(x)).toEqual(['foo', 'x']);
    });
});

describe('matchingStrategy', () => {
    it('should parse a flag', () => {
        const s = matchingStrategy({ flag: ['--flag'] }, { option: ['--option='] });
        const x = '--flag';
        expect(s.matchFlag(x)).toEqual('flag');
    });

    it('should parse an option', () => {
        const s = matchingStrategy({ flag: ['--flag'] }, { option: ['--option='] });
        const x = '--option=';
        expect(s.matchOption(x)).toEqual('option');
    });

    it('should parse a compact option', () => {
        const s = matchingStrategy({ flag: ['--flag'] }, { option: ['--option='] });
        const x = '--option=Hello';
        expect(s.matchCompactOption(x)).toEqual(['option', 'Hello']);
    });

    it('should not work when not exact', () => {
        const s = matchingStrategy({ flag: ['--flag'] }, { option: ['--option='] });

        const x = '--flaG';
        expect(s.matchFlag(x)).toEqual(null);

        const y = '--opTION=';
        expect(s.matchOption(y)).toEqual(null);
        expect(s.matchCompactOption(y)).toEqual(null);
    });

    it('should parse a flag (sensitivity = base)', () => {
        const s = matchingStrategy({ flag: ['--flag'] }, {}, 'en-US', { sensitivity: 'base' });

        const x = '--FLAG';
        expect(s.matchFlag(x)).toEqual('flag');

        const y = '--flág';
        expect(s.matchFlag(y)).toEqual('flag');
    });
});

describe('mapKeys', () => {
    it('maps the keys according to a function', () => {
        const st = mapKeys(longStrategy(), s => s + '!');
        const x = '--foo';
        expect(st.matchFlag(x)).toEqual('foo!');
    });

    it('maps the keys according to a function (compact option)', () => {
        const st = mapKeys(longStrategy(), s => s + '!');
        const x = '--foo=bar';
        expect(st.matchCompactOption(x)).toEqual(['foo!', 'bar']);
    });

    it('can remove a match from a strategy', () => {
        const st = mapKeys(longStrategy(), s => s === 'foo' ? null : s + '!');

        const x = '--foo';
        expect(st.matchFlag(x)).toEqual(null);

        const y = '--bar';
        expect(st.matchFlag(y)).toEqual('bar!');
    });
});

describe('renameKeys', () => {
    it('renames keys', () => {
        const st = renameKeys(longStrategy(), { foo: ['bar'] });
        const x = '--bar';
        expect(st.matchFlag(x)).toEqual('foo');
    });

    it('can keep keys that are not found', () => {
        const st = renameKeys(longStrategy(), { foo: ['bar'] }, true);
        const x = '--quux';
        expect(st.matchFlag(x)).toEqual('quux');
    });

    it('can discard keys that are not found', () => {
        const st = renameKeys(longStrategy(), { foo: ['bar'] }, false);
        const x = '--quux';
        expect(st.matchFlag(x)).toEqual(null);
    });

    it('should not rename when not exact', () => {
        const st = renameKeys(longStrategy(), { foo: ['bar'] });
        const x = '--Bar';
        expect(st.matchFlag(x)).toEqual('Bar');
    });

    it('renames keys (sensitivity = base)', () => {
        const st = renameKeys(longStrategy(), { foo: ['bar'] }, true, 'en-US', { sensitivity: 'base' });
        const x = '--BAR';
        expect(st.matchFlag(x)).toEqual('foo');
    });
});
