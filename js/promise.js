function emptyFn() {};

class MyPromise {
    constructor(executor) {
        this.callbacks = [];

        this.errorHandler = emptyFn;
        this.finallyHandler = emptyFn;

        this._state = 'pending';
        this._result = '';

        try {
            executor.call(null, this.resolveHandler.bind(this), this.rejectHandler.bind(this));
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

        this._state = 'fulfilled';
        this._result = data;

        this.finallyHandler();
    }

    rejectHandler(error) {
        console.log(error);
        this.errorHandler(error);

        this._state = 'rejected';
        this._result = error;

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
        const results = [];

        arr.forEach(async function(promise) {
            let resultPromise = await promise;
            if (resultPromise instanceof Error) return resultPromise;
            results.push(resultPromise);
        });

        return results;
        // выполняем каждый промис
        // записываем его результат в массив
        // возвращаем массив, если все в порядке
        // возвращаем ошибку, если кто-то упал

    }


}

module.exports = MyPromise;



const promise = new MyPromise((resolve, reject) => {
    setTimeout(() => {
        reject();
    }, 150);
});

promise
    .then(data => console.log('MyPromise: ', data.toLowerCase()))
    .catch(err => console.log('MyPromiseError: ', err))
    .finally(() => console.log('Finally!'))