const MyPromise = require('./promise');

describe('MyPromise: ', () => {

    let promise, executorWatcher;
    const successResult = 42;
    const errorResult = 'I am error';

    jest.useFakeTimers();

    beforeEach(() => {
        executorWatcher = jest.fn((resolve) => setTimeout(() => resolve(successResult), 150));
        promise = new MyPromise(executorWatcher);
    });

    test('should exists and to be typeof function', () => {
        expect(MyPromise).toBeDefined;
        expect(typeof MyPromise).toBe('function');
    });

    test('instance should have methods: then, catch, finally', () => {
        expect(promise.then).toBeDefined;
        expect(promise.catch).toBeDefined;
        expect(promise.finally).not.toBeUndefined;
    });

    test('should call executor function', () => {
        expect(executorWatcher).toHaveBeenCalled();
    });

    test('should get data in then-block and chain them', async() => {
        const result = await promise.then(num => num).then(num => num * 2);
        expect(result).toBe(successResult * 2);
    });

    test('should catch error', () => {
        const errorExecutor = (_, reject) => setTimeout(() => reject(errorResult), 150);
        const errorPromise = new MyPromise(errorExecutor);

        return new Promise(resolve => {
            errorPromise.catch(error => {
                expect(error).toBe(errorResult);
                resolve();
            });
        });
    });

    test('should call finally method', async() => {
        const finallyWatcher = jest.fn(() => {});

        await promise.finally(finallyWatcher);
        expect(finallyWatcher).toHaveBeenCalled();
    });
});