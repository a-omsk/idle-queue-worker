// @flow

import Abstract from './Abstract';

type Callback<T, R> = (item:T) => R;

export default class Mapable<T, R> extends Abstract<T, R> {
    result: Array<R>;

    constructor(...args:Array<any>) {
        super(...args);

        this.result = [];
    }

    terminate() {
        super.terminate();
        this.result = [];
    }

    map(callback:Callback<T, R>):Mapable<T, R> {
        this.worker.register((item:T) => {
            const result = callback(item);

            this.result.push(result);
            this.handlers.forEach(handler => handler(result));
        });

        return this;
    }

    take(count:number):Promise<Array<R>> {
        return new Promise(resolve => {
            this.handlers.push(() => {
                if (this.result.length >= count) {
                    resolve(this.result.splice(0, count));
                    this.terminate();
                }
            });
        });
    }

    takeUntil(predicate:(item:R) => boolean):Promise<Array<R>> {
        return new Promise(resolve => {
            this.handlers.push(e => {
                if (predicate(e)) {
                    resolve(this.result);
                    this.terminate();
                }
            });
        });
    }
}
