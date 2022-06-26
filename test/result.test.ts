import { ok, err, orResultAll, orResultFirst, orResultLast } from '../src';

describe('orResultAll', () => {
    it('gives the first ok', () => {
        expect(orResultAll(err(0), ok(1), ok(2))).toEqual(ok(1));
    });

    it('gives all the errs when no ok', () => {
        expect(orResultAll(err(0), err(1), err(2))).toEqual(err([0, 1, 2]));
    });
});

describe('orResultFirst', () => {
    it('gives the first ok', () => {
        expect(orResultFirst(err(0), ok(1), ok(2))).toEqual(ok(1));
    });

    it('gives the first err when no ok', () => {
        expect(orResultFirst(err(0), err(1), err(2))).toEqual(err(0));
    });
});

describe('orResultLast', () => {
    it('gives the first ok', () => {
        expect(orResultLast(err(0), ok(1), ok(2))).toEqual(ok(1));
    });

    it('gives the last err when no ok', () => {
        expect(orResultLast(err(0), err(1), err(2))).toEqual(err(2));
    });
});
