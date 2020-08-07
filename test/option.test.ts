import { maybeOption, some, none, orOption } from '../src';

describe('maybeOption', () => {
    it('should work', () => {
        expect(maybeOption(1)).toEqual(some(1));
        expect(maybeOption(null)).toEqual(none());
        expect(maybeOption(undefined)).toEqual(none());
    });
});

describe('orOption', () => {
    it('gives none on zero options', () => {
        expect(orOption()).toEqual(none());
    });

    it('gives the first some', () => {
        expect(orOption(none(), some(1), some(2))).toEqual(some(1));
    });
});
