import scope from './scope';

describe('scope', () => {
    let newscope;
    beforeEach(() => {
        newscope = new scope();
    });
    it('cons', () => {
        newscope.a = 1;
        expect(newscope.a).toBe(1);
    });
    it('is need digest once', () => {
        newscope.a = 1;
        const fn = jasmine.createSpy();
        newscope.$watch(() => {
            return 2;
        }, fn);
        newscope.$digest();
        expect(fn).toHaveBeenCalled();
    });
    it('watch need exc 2s', () => {
        newscope.a = 1;
        let Wnum = 0;
        let Lnum = 0;
        newscope.$watch(() => {
            Wnum++;
        }, () => {
            Lnum++;
        });
        newscope.$digest();
        expect(Wnum).toBe(2);
        expect(Lnum).toBe(1);
    });
    it('test del watch', () => {
        const unwatch = newscope.$watch(() => {
            return 2;
        });
        newscope.$watch(() => {
            return 5;
        });
        expect(newscope.$$watchList.length).toBe(2);
        unwatch();
        expect(newscope.$$watchList.length).toBe(1);
        expect(newscope.$$watchList[0].watchFn()).toBe(5);
    });
});
