class MyPromise {
    constructor(executor) {
        this.callbacks = [];

        this.errorHandler = function() {};
        this.finallyHandler = function() {};

        this._state = 'pending';
        this._result = null;

        try {
            executor.call(null, this.resolveHandler.bind(this), this.rejectHandler.bind(this));
        } catch (err) {
            this.errorHandler(err)
        } finally {
            this.finallyHandler();
        }
    }

    static resolveHandler(data) {
        this._state = 'fulfilled';
        this._result = data;

        this.callbacks.forEach(cb => cb(this._result));

        this.finallyHandler();
    }

    static rejectHandler(error) {
        this._state = 'rejected';
        this._result = error;

        this.errorHandler(this._result);
        this.finallyHandler();
    }

    then(cbResolve, cbReject) {
        if (cbResolve === null) this.catch(cbReject);

        this.callbacks.push(cbResolve);
        return this;
    }

    catch (cb) {
        this.errorHandler = cb;
        return this;
    } finally(cb) {
        this.finallyHandler = cb;
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

module.exports = MyPromise;



const promise = new MyPromise((resolve, reject) => {
    setTimeout(() => {
        resolve('1');
    }, 150);
});

promise
    .then(data => console.log('MyPromise: ', data))
    // .then(data => console.log('MyPromise: ', +data + 1))
    // .then(data => console.log('MyPromise: ', +data + 1))
    // .then(data => console.log('MyPromise: ', +data + 1))
    .catch(error => console.log('MyPromiseError: ', error.message))
    .finally(() => console.log('Finally!'))