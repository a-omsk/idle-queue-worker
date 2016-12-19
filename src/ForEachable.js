// @flow

import QueueWorker from './QueueWorker';

type Callback<T> = (item:T) => any;

export default class ForEachable<T> {
    worker:QueueWorker<T>;

    constructor(...args:Array<any>) {
        this.worker = new QueueWorker(...args);
    }

    enqueue(item:T) {
        this.worker.enqueue(item);
    }

    forEach(callback:Callback<T>):ForEachable<T> {
        this.worker.register(callback);
        return this;
    }
}