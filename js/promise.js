function emptyFn() {};

class MyPromise {
    constructor(executor) {
        this.callbacks = [];

        this.errorHandler = emptyFn;
        this.finallyHandler = emptyFn;

        this._state = 'pending';
        this._result = null;

        try {
            executor.call(null, this.resolveHandler.bind(this), this.rejectHandler.bind(this));
        } finally {
            this.finallyHandler();
        }
    }

    resolveHandler(data) {
        this._state = 'fulfilled';
        this._result = data;

        if (this.callbacks.length !== 0) {
            this.callbacks.forEach(cb => {
                this._result = cb(this._result)
            });
        }

        this.finallyHandler();
    }

    rejectHandler(error) {
        this._state = 'rejected';
        this._result = error;

        this.errorHandler(this._result);
        this.finallyHandler();
    }

    then(cb) {
        this.callbacks.push(cb);
        return this;
    }

    catch (cb) {
        this.errorHandler(this._result);
        return this;
    } finally(cb) {
        this.finallyHandler();
        return this;
    }

    static resolve(data) {
        this._result = data;

        const test = this;
        console.log(new test());
        return new test();
    }

    static all(iterable) {
        let results = [];
        let counter = 0;

        iterable.forEach(async(promise, index) => {
            let resultPromise = await promise;
            if (resultPromise instanceof Error) return resultPromise;
            results[index] = resultPromise;
            counter++;

            if (counter === iterable.length) {
                console.log(results);
                return this.resolve(results)
            }
        });
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
//     .catch(error => console.log('MyPromiseError: ', error.message))
//     .finally(() => console.log('Finally!'))


MyPromise.all([
        new MyPromise(resolve => setTimeout(() => resolve(1), 3000)), // 1
        new MyPromise(resolve => setTimeout(() => resolve(2), 2000)), // 2
        new MyPromise(resolve => setTimeout(() => resolve(3), 1000)) // 3
    ])
    .then(data => console.log(data));


// const promise = new Promise((resolve, reject) => {
//     setTimeout(() => {
//         resolve(this);
//     }, 150);
// });

// promise
//     .then(data => {
//         console.log(data);
//     })