// @flow

import Abstract from './Abstract';

type FoldFn<T, R> = (accumulator:R, element:T) => R;

export default class Foldable<T, R> extends Abstract<T, R> {
    result: R | null;

    constructor(...args:Array<any>) {
        super(...args);
        this.result = null;
    }

    terminate():void {
        super.terminate();
        this.result = null;
    }

    fold(callback:FoldFn<T, R>, initialValue:R):Foldable<T, R> {
        this.worker.register((item:T) => {
            this.result = [item].reduce(callback, this.result || initialValue);
            this.handlers.forEach(handler => this.result !== null && handler(this.result));
        });

        return this;
    }

    foldUntil(predicate:(item:R) => boolean):Promise<?R> {
        return new Promise(resolve => {
            this.handlers.push((item:R) => {
                if (!predicate(item)) {
                    return;
                }

                resolve(this.result);
                this.terminate();
            });
        });
    }
}
