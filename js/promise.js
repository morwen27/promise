function emptyFn(){};

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

        this.callbacks.forEach(cb => {
            this._result = cb(this._result)
        });

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

    catch(cb) {
        this.errorHandler(this._result);
        return this;
    }

    finally(cb) {
        this.finallyHandler();
        return this;
    }

    // all(arr) {
    //     const results = [];

    //     arr.forEach(async function(promise) {
    //         let resultPromise = await promise;
    //         if (resultPromise instanceof Error) return resultPromise;
    //         results.push(resultPromise);
    //     });

    //     return results;
    //     // выполняем каждый промис
    //     // записываем его результат в массив
    //     // возвращаем массив, если все в порядке
    //     // возвращаем ошибку, если кто-то упал

    // }


}

const promise = new MyPromise((resolve, reject) => {
    setTimeout(() => {
        resolve('RERE');
    }, 150);
});

promise
    .then(data => {
        console.log('MyPromise: ', data.toLowerCase());
        return data;
    })
    .then(data => {
        console.log('MyPromise: ', data.toUpperCase());
        return data;
    })
    .then(data => {
        console.log('MyPromise: ', data.toUpperCase()[0] + data.toLowerCase().slice(1));
        return data;
    })    
    .catch(error => console.log('MyPromiseError: ', error.message))
    .finally(() => console.log('Finally!'))
