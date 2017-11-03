function setupModuleLoader(window) {
    var ensure = function (obj, name, factory) {
        return obj[name] || (obj[name] = factory());
    };

    var angular = ensure(window, 'angular', Object);

    var createModule = function (name, requires) {
        var invokeQueue = [];
        var moduleInstance = {
            name: name,
            constant: function (key, val) {
                invokeQueue.push(['constant', [key, val]]);
            },
            provider: function (provider) {
                invokeQueue.push(['provider', [provider]]);
            },
            _invokeQueue: invokeQueue
        };
        return moduleInstance;
    };
    var getModule = function (name, modules) {
        return modules[name];
    };

    ensure(angular, 'module', function () {
        var modules = {};
        return function (name, requires) {
            if (requires) {
                return createModule(name, requires);
            } else {
                return getModule(name, modules);
            }

        };
    });
}

export default setupModuleLoader;
