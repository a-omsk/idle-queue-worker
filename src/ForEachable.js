// @flow

import Abstract from './Abstract';

type Callback<T> = (item:T) => any;

export default class ForEachable<T> extends Abstract<T, T> {
    forEach(callback:Callback<T>):ForEachable<T> {
        this.worker.register((item:T) => {
            callback(item);
            this.handlers.forEach(handler => handler(item));
        });

        return this;
    }
}
