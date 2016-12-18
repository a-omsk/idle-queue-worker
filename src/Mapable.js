// @flow

import QueueWorker from './QueueWorker';

type Callback<T, R> = (item:T) => R;
type Handler<R> = (item:R) => any;

interface QueueInterface<T> {
    enqueue(item:T): any
}

export default class Mapable<T,R> {
    worker: QueueWorker<T>;
    result: Array<R>;
    handlers: Array<Handler<R>>;
    terminated: boolean;

    constructor(...args:Array<any>) {
        this.worker = new QueueWorker(...args);
        this.result = [];
        this.handlers = [];
        this.terminated = false;
    }

    enqueue(item:T) {
        if (this.terminated) {
            return;
        }

        this.worker.enqueue(item);
    }

    pipe(queue:QueueInterface<R>):QueueInterface<R> {
        this.handlers.push((item:R) => {
            queue.enqueue(item);
        });

        return queue;
    }

    terminate() {
        this.terminated = true;
        this.result = [];
        this.handlers = [];
    }

    map(callback:Callback<T,R>):Mapable<T,R> {
       this.worker.register((item:T) => {
            const result = callback(item);

            this.result.push(result);
            this.handlers.forEach(handler => handler(result));
        });

        return this;
    }

    take(count:number):Promise<Array<R>> {
        return new Promise(resolve => {
            this.handlers.push(e => {
                if (this.result.length  >= count) {
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
