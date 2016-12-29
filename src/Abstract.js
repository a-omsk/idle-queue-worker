// @flow

import QueueWorker from './QueueWorker';

interface QueueInterface<T> {
    enqueue(item:T): any
}

type Handler<R> = (item:R) => any;

export default class Abstract<T, R> {
    worker:QueueWorker<T>;
    handlers:Array<Handler<R>>;
    terminated:boolean;

    constructor(...args:Array<any>) {
        // $FlowIssue: https://github.com/facebook/flow/issues/1152
        if (new.target === Abstract) {
            throw new TypeError('Cannot construct Abstract instance directly');
        }

        this.worker = new QueueWorker(...args);
        this.handlers = [];
        this.terminated = false;
    }

    enqueue(item:T) {
        if (!this.terminated) {
            this.worker.enqueue(item);
        }

        return this;
    }

    pipe(queue:QueueInterface<R>):QueueInterface<R> {
        this.handlers.push((item:R) => {
            queue.enqueue(item);
        });

        return queue;
    }

    terminate() {
        this.terminated = true;
        this.handlers = [];
    }
}
