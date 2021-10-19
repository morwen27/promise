function emptyFn() {};

class MyPromise {
    constructor(executor) {
        this.callbacks = [];

        this.errorHandler = emptyFn;
        this.finallyHandler = emptyFn;

        _this.state = 'pending';
        _this.result = '';

        try {
            executor.call(null, this.resolveHandler.bind(this), this.resolveHandler.bind(this));
        } catch (err) {
            this.errorHandler(err)
        } finally {
            this.finallyHandler();
        }

    }

    resolveHandler(data) {
        this.callbacks.forEach(cb => {
            data = cb(data);
        });

        _this.state = 'fulfilled';
        _this.result = data;

        this.finallyHandler();
    }

    rejectHandler(error) {
        this.errorHandler(error);

        _this.state = 'rejected';
        _this.result = error;

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

    all(arr) {

    }


}

// const promise = new MyPromise((resolve, reject) => {
//     setTimeout(() => {
//         resolve('NgRx');
//     }, 150);
// });

// promise
//     .then(data => console.log('MyPromise: ', data.toUpperCase()))
//     .then(title => console.log(title))
//     .catch(err => console.log('MyPromise: ', err))
//     .finally(() => console.log('Finally!'))

module.exports = MyPromise;