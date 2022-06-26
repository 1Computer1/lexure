import { some, none, orOption } from '../src';

describe('orOption', () => {
    it('gives none on zero options', () => {
        expect(orOption()).toEqual(none);
    });

    it('gives the first some', () => {
        expect(orOption(none, some(1), some(2))).toEqual(some(1));
    });
});
