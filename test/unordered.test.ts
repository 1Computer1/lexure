import { noStrategy, longStrategy, longShortStrategy, caseInsensitiveStrategy } from '../src/';

describe('no strategy', () => {
    it('should be false and null', () => {
        const s = noStrategy();
        expect(s.matchFlag('foo')).toEqual(null);
        expect(s.matchOption('bar')).toEqual(null);
        expect(s.matchCompactOption('baz')).toEqual(null);
    });
});

describe('long strategy', () => {
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

describe('long short strategy', () => {
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

    it('should parse a compact option exclusively', () => {
        const s = longShortStrategy();
        const x = '--foo=x';
        expect(s.matchFlag(x)).toEqual(null);
        expect(s.matchOption(x)).toEqual(null);
        expect(s.matchCompactOption(x)).toEqual(['foo', 'x']);
    });

    it('should parse a short compact option exclusively', () => {
        const s = longShortStrategy();
        const x = '-f3';
        expect(s.matchFlag(x)).toEqual(null);
        expect(s.matchOption(x)).toEqual(null);
        expect(s.matchCompactOption(x)).toEqual(['f', '3']);
    });
});

describe('case insensitive strategy', () => {
    it('should parse a flag', () => {
        const s = caseInsensitiveStrategy(['flag'], ['option'], ['compactOption']);
        const x = 'FLAG';
        expect(s.matchFlag(x)).toEqual('flag');
    });

    it('should parse an option', () => {
        const s = caseInsensitiveStrategy(['flag'], ['option'], ['compactOption']);
        const x = 'OPTION';
        expect(s.matchOption(x)).toEqual('option');
    });

    it('should parse a compact option', () => {
        const s = caseInsensitiveStrategy(['flag'], ['option'], ['compactOption']);
        const x = 'COMPACTOptionHello';
        expect(s.matchCompactOption(x)).toEqual(['compactOption', 'Hello']);
    });
});
