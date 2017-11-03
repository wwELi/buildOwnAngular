export function createInjector(loaderName) {
    var instanceCache = {};
    var providerCache = {};
    var INSTANTIATING = {};
    var arr = [];
    var modules = {};

    var providerInjector = createInternalInjector(providerCache, () => { throw new Error('no provider'); });
    var instanceInjector = createInternalInjector(instanceCache, key => {
        var provider = providerInjector.get(key + 'provider');
        return instanceInjector.invoke(provider.$get, provider);
    });

    var $prover = {
        constant: function (key, val) {
            if (key === 'hasOwnProperty') {
                throw new Error('hasOwnProperty is not a valid key');
            }
            instanceCache[key] = val;
        },
        provider: function (key, provider) {
            Object.prototype.toString.call(provider) === '[Object Function]' && (provider = instanceInjector.instantiate(provider));
            providerCache[key + 'provider'] = provider;
        }
    };

    loaderName.forEach(moduleName => {
        var moduleQueue = window.angular.module(moduleName)._invokeQueue;
        if (!modules.hasOwnProperty(moduleName)) {
            modules[moduleName] = true;
            moduleQueue.forEach(args => {
                $prover[args[0]].apply($prover, args[1]);
            });
        }

    });

    function createInternalInjector(cache, factoryFn) {
        function getService(key) {
            if (cache.hasOwnProperty(key)) {
                if (cache[key] === INSTANTIATING) {
                    throw new Error('-----------', arr.join('-->'));
                }
                return cache[key];
            } else {
                cache[key] = INSTANTIATING;
                arr.unshift(key);
                try {
                    var instance = factoryFn(key);
                    cache[key] = instance;
                    return instance;
                } finally {
                    arr.shift();
                    cache[key] === INSTANTIATING && delete cache[key];
                }
            }

        }
        function invoke(fn, self, locals) {
            var args = annotate(fn).map(item => locals && locals[item] ? locals[item] : getService(item));
            return fn.apply(self, args);
        };
        function annotate(fn) {
            return fn.$inject ? fn.$inject : fn.slice(0, fn.length - 1);
        }
        function instantiate(constructorFn, locals) {
            var instance = Object.create(constructorFn.prototype)
            invoke(constructorFn, instance, locals);
            return instance;
        }
        return {
            has: key => $prover.hasOwnProperty(key),
            get: getService,
            invoke: invoke,
            annotate: annotate,
            instantiate: instantiate
        };

    }
    return instanceInjector;

};
