function emptyFn() {};

class MyPromise {
    constructor(executor) {
        this.callbacks = [];

        this.errorHandler = emptyFn;
        this.finallyHandler = emptyFn;

        this._statuses = {
            pending: 'PENDING',
            fulfilled: 'FULFILLED',
            rejected: 'REJECTED'
        };
        this._state = this._statuses.pending;
        this._result = null;

        try {
            executor.call(null, this.resolveHandler.bind(this), this.rejectHandler.bind(this));
        } catch (err) {
            this.errorHandler(err);
        } finally {
            this.finallyHandler();
        }
    }

    resolveHandler(data) {
        this._state = this._statuses.fulfilled;
        this._result = data;

        if (this.callbacks.length !== 0) {
            this.callbacks.forEach(cb => {
                this._result = cb(this._result)
            });
        }

        this.finallyHandler();
    }

    rejectHandler(error) {
        this._state = this._statuses.rejected;
        this._result = error;

        this.errorHandler(this._result);
        this.finallyHandler();
    }

    then(cb) {
        this.callbacks.push(cb);
        return this;
    }

    catch (cb) {
        this.errorHandler = cb;
        return this;
    } finally(cb) {
        this.finallyHandler = cb;
        return this;
    }

    static all(iterable) {
        return new MyPromise((resolve, reject) => {
            let results = [];
            let counter = 0;

            iterable.forEach(async(promise, index) => {
                let resultPromise = await promise.catch(error => reject(error));
                results[index] = resultPromise;
                counter++;

                if (counter === iterable.length) resolve(results);
            });
        }).catch(error => error);
    }

    static allSettled(iterable) {
        return new MyPromise((resolve, reject) => {
            let results = [];
            let counter = 0;

            iterable.forEach(async(promise, index) => {
                await promise
                    .then(data => {
                        const result = {
                            status: promise._state,
                            value: data,
                        }
                        results[index] = result;
                        counter++;
                    })
                    .catch(error => {
                        const result = {
                            status: promise._state,
                            reason: error,
                        };
                        results[index] = result;
                        counter++;
                    });

                if (counter === iterable.length) resolve(results);
            });
        }).catch(error => error);
    }

    static race(iterable) {
        return new MyPromise((resolve, reject) => {
            let results = [];

            iterable.forEach(async promise => {
                await promise
                    .then(result => {
                        results.push(result);
                        if (results.length === 1) resolve(result)
                    })
                    .catch(error => {
                        results.push(error);
                        if (results.length === 1) reject(error)
                    });
            });
        }).catch(error => error);
    }
}



// const promise = new MyPromise((resolve, reject) => {
//     setTimeout(() => {
//         resolve('RERE');
//     }, 150);
// });

// promise
//     .then(data => {
//         console.log('MyPromise: ', data.toLowerCase());
//         return data;
//     })
//     .then(data => {
//         console.log('MyPromise: ', data.toUpperCase());
//         return data;
//     })
//     .then(data => {
//         console.log('MyPromise: ', data.toUpperCase()[0] + data.toLowerCase().slice(1));
//         return data;
//     })
//     .catch(error => console.log('MyPromiseError: ', error))
//     .finally(() => console.log('Finally!'))


MyPromise.allSettled([
        new MyPromise(resolve => setTimeout(() => resolve(1), 3000)), // 1
        new MyPromise((resolve, reject) => setTimeout(() => reject(new Error("???????????? ???? all!")), 2000)), // 2
        new MyPromise(resolve => setTimeout(() => resolve(3), 1000)) // 3
    ])
    .then(data => console.log(data))
    .catch(error => console.log(error));

// MyPromise.all([
//         new MyPromise(resolve => setTimeout(() => resolve(1), 3000)), // 1
//         new MyPromise(resolve => setTimeout(() => resolve(2), 2000)), // 2
//         new MyPromise(resolve => setTimeout(() => resolve(3), 1000)) // 3
//     ])
//     .then(data => console.log(data))
//     .catch(error => console.log(error));


// MyPromise.race([
//         new MyPromise(resolve => setTimeout(() => resolve(1), 3000)), // 1
//         new MyPromise((resolve, reject) => setTimeout(() => reject(new Error("???????????? ???? race!")), 2000)), // 2
//         new MyPromise(resolve => setTimeout(() => resolve(3), 1000)) // 3
//     ])
//     .then(data => console.log(data))
//     .catch(error => console.log(error));

// MyPromise.race([
//         new MyPromise((resolve, reject) => setTimeout(() => reject(new Error("???????????? ???? race!")), 1000)), // 2
//         new MyPromise(resolve => setTimeout(() => resolve(3), 2000)) // 3
//     ])
//     .then(data => console.log(data))
//     .catch(error => console.log(error));

// MyPromise.race([
//         new MyPromise(resolve => setTimeout(() => resolve(1), 3000)), // 1
//         new MyPromise(resolve => setTimeout(() => resolve(2), 2000)), // 2
//         new MyPromise(resolve => setTimeout(() => resolve(3), 1000)) // 3
//     ])
//     .then(data => console.log(data))
//     .catch(error => console.log(error));