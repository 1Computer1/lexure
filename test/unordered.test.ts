import { noStrategy, longStrategy, longShortStrategy, prefixedStrategy, matchingStrategy } from '../src/';

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
