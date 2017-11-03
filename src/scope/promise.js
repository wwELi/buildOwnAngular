export default function defer() {
    const resolveCache = [];
    const rejectCache = [];
    const finallyache = [];
    const $promise = {
        then(successfn = () => {}, failfn = () => {}) {
            resolveCache.push(successfn);
            rejectCache.push(failfn);
            return this;
        },
        finally(fn) {
            finallyache.push(fn);
        }
    };
    const handerFn = function (val) {
        const deal = arr => {
            arr.forEach(f => {
                if (Object.prototype.toString.call(f) === '[object Function]') {
                   const p = f(val);
                } else {
                    throw new TypeError(`${f.name} not is function`);
                }

            });
        };
        try {
            deal(this);
        } catch (e) {
            throw e;
        } finally {
            deal(finallyache);
        }
    };
    return {
        resolve(val) {
            handerFn.call(resolveCache, val);
        },
        reject(val) {
            handerFn.call(rejectCache, val);
        },
        $promise
    };

}
