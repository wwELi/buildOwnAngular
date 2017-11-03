import defer from './promise';

console.log('', defer());

const promise = defer();

setTimeout(() => {
    promise.resolve('hello');
}, 1000);

const p = promise.$promise.then(() => {
    console.log('%%%%%%%%%%%%%%%%%%%%');
}).finally(() => {
    console.log('====================');
});

console.log('^^^^', p);
