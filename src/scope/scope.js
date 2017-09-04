export default class scope {
    constructor() {
        this.$$watchList = [];
        this.$$asyncQueue = [];
        this.$$children = [];
        this.$$listeners = [];
    }

    $watch(watchFn, calledFn = () => {
    }) {
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

    $$everyScope(fn) {
        if (fn(this)) {
            return this.$$children.every(child => child.$$everyScope(fn));
        }
    }

    $digestOnce() {
        let isDirty;
        let isloop = true;
        this.$$everyScope(scope => {
            scope.$$watchList.forEach(watch => {
                try {
                    let newVal = watch.watchFn();
                    let oldVal = watch.last;
                    if (!Object.is(newVal, oldVal)) {
                        this.$$lastDirtyVal = watch;
                        watch.last = newVal;
                        watch.calledFn(newVal, oldVal === this.initLastVal ? newVal : oldVal);
                        isDirty = true;
                    } else if (this.$$lastDirtyVal === watch) {
                        isloop = false;
                        return false;
                    }
                } catch (e) {
                    throw e;
                }
                return isloop;
            });
        });

        return isDirty;
    }

    $digest() {
        let isDirty;
        let count = 10;
        this.$$lastDirtyVal = null;
        do {
            while (this.$$asyncQueue.length) {
                const task = this.$$asyncQueue.shift();
                this.$eval(task.expression);
            }
            if ((isDirty || this.$$asyncQueue.length) && !count--) {
                throw new Error('more than 10 s');
            }
            isDirty = this.$digestOnce();
        } while (isDirty || this.$$asyncQueue.length);
    }

    $eval(expr, locals) {
        return expr(this, locals);
    }

    $apply(expr) {
        try {
            return this.$eval(expr);
        } catch (e) {
            throw e;
        } finally {
            this.$digest();
        }

    }

    $evalAsync(expr) {
        this.$$asyncQueue.push({scope: this, expression: expr});
    }

    $new(isolated) {
        let childScope;
        if (isolated) {
            childScope = new scope();
        } else {
            const constructor = () => {
            };
            constructor.prototype = this;
            childScope = new constructor();
        }

        childScope.$$watchList = [];
        childScope.$$listeners = {};
        childScope.$parent = this;
        this.$$children.push(childScope);
        return childScope;
    }

    $on(eventName, listener) {
        let listeners = this.$$listeners[eventName];
        if (!listeners) {
            this.$$listeners[eventName] = listeners = [];
        }
        listeners.push(listener);
        return () => {
            const index = listener.indexOf(listener);
            index >= 0 && (listeners[index] = null);
        };
    }

    $emit(eventName, ...otherAgrs) {
        let event = {name: eventName};
        let listenerArgs = [event].concat([...otherAgrs]);
        let scope = this;
        do {
            scope.$$fireEventOnScope(eventName, listenerArgs);
            scope = scope.$parent;
        } while (scope);
        return event;
    }

    $broadcast(eventName, otherAgrs) {
        let event = {name: eventName};
        let listenerArgs = [event].concat([...otherAgrs]);
        this.$$everyScope(scope => {
            scope.$$fireEventOnScope(eventName, listenerArgs);
            return true;
        });
        this.$$fireEventOnScope(eventName, listenerArgs);
        return event;
    }

    $$fireEventOnScope(eventName, otherAgrs) {
        let listeners = this.$$listeners[eventName] || [];
        let i = 0;
        while (i < listeners.length) {
            const item = listeners[i];
            item === null ? listeners.splice(i, 1) : item.apply(null, otherAgrs);
        }
        ;
        return event;
    }

    initLastVal() {
    }


}
