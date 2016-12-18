// @flow

import QueueWorker from './QueueWorker';

type FoldFn<T,R> = (accumulator:R, element:T) => R;
type Handler<R> = (item:R) => any;

interface QueueInterface<T> {
    enqueue(item:T): any
}

export default class Foldable<T,R> {
    worker: QueueWorker<T>;
    result: ?R;
    handlers: Array<Handler<R>>;
    terminated: boolean;
    passThrough: ?Handler<R>;

    constructor(...args:Array<any>) {
        this.worker = new QueueWorker(...args);
        this.result = null;
        this.handlers = [];
        this.terminated = false;
        this.passThrough = null;
    }

    enqueue(item:T):Foldable<T,R> {
        this.worker.enqueue(item);
        return this;
    }

    pipe(queue:QueueInterface<R>):QueueInterface<R> {
        this.passThrough = (item:R) => queue.enqueue(item);

        return queue;
    }

    terminate():void {
        this.terminated = true;
        this.result = null;
        this.handlers = [];
    }

    fold(callback:FoldFn<T,R>, initialValue:R):Foldable<T,R> {
        this.worker.register((item:T) => {
            this.result = [item].reduce(callback, this.result || initialValue);
            this.handlers.forEach(handler => this.result && handler(this.result));
        });

        return this;
    }

    foldUntil(predicate:(item:R) => boolean):Promise<R> {
        return new Promise(resolve => {
            this.handlers.push((item:R) => {
                if (!predicate(item) || !this.result) {
                    return;
                }
                                       
                this.passThrough && this.passThrough(this.result);
                resolve(this.result);
                this.terminate(); 
            });
        });
    }
}