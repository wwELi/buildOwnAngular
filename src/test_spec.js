import {sayHello} from './test.js';

describe('test', () => {
    it('s', () => {
        expect(sayHello()).toBe(22);
        let arr = ['a', 'b', 'c'];
        arr.forEach((item, index, array) => {
            if (item === 'b') {
                arr.splice(arr.indexOf('b'), 1);
            }
            console.log(item, index, array);
        });
    });
});
