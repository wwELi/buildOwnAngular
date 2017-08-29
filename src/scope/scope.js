export default class scope {
    constructor() {
        this.$$watchList = [];
    }

    $watch(watchFn, calledFn = () => {}) {
        this.$$watchList.push({
            watchFn,
            calledFn,
            last: this.initLastVal
        });
        const index = this.$$watchList.length - 1;
        return () => {
            this.$$watchList.splice(index, 1);
        };
    }

    $digestOnce() {
        let isDirty;
        this.$$watchList.forEach(watch => {
            try {
                let newVal = watch.watchFn();
                let oldVal = watch.last;
                if (!Object.is(newVal, oldVal)) {
                    this.$$lastDirtyVal = watch;
                    watch.last = newVal;
                    watch.calledFn(newVal, oldVal === this.initLastVal ? newVal : oldVal);
                    isDirty = true;
                } else if (this.$$lastDirtyVal === watch) {
                    return false;
                }
            } catch (e) {
                throw e;
            }
        });
        return isDirty;
    }

    $digest() {
        let isDirty;
        let count = 10;
        this.$$lastDirtyVal = null;
        do {
            if (isDirty && !count--) {
                throw new Error('more than 10 s');
            }
            isDirty = this.$digestOnce();
        } while (isDirty);
    }

    $eval(expr) {
        return expr(this);
    }

    initLastVal() {
    }
}
