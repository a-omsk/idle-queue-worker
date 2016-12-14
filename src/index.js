// @flow

import { requestIdleCallback, cancelIdleCallback } from './request-idle-callback-shim';
import type { Deadline } from './request-idle-callback-shim';

type IsReady = () => boolean;
type Callback<T> = (item:T) => any;

const defaultIsReady = () => true;

export default class QueueWorker<T> {
    queue:Array<T>;
    callback:Callback<T>;
    isReady:IsReady;
    timeout:number;
    isScheduled:boolean;
    task:?number;

    constructor(callback:Callback<T>, isReady:IsReady = defaultIsReady, queue:Array<T> = [], timeout:number = 3000) {
        this.queue = queue;
        this.callback = callback;
        this.isReady = isReady;
        this.timeout = timeout;
        this.isScheduled = false;

        this.task = null;

        if (this.queue.length) {
            this.schedule();
        }
    }

    enqueue(data:T):void {
        this.queue.push(data);

        if (!this.isScheduled) {
            this.schedule();
        }
    }

    schedule():void {
        const hasWork = this.queue.length !== 0;

        if (!hasWork) {
            this.isScheduled = false;
            return;
        }

        this.isScheduled = true;
        this.task = requestIdleCallback(this.idleHandler, { timeout: this.timeout });
    }

    idleHandler = (deadline:Deadline):void => {
        if (!this.isReady()) {
            return this.schedule();
        }

        while (deadline.timeRemaining() > 0 && this.queue.length > 0) {
            this.callback(this.queue.shift());
        }

        this.schedule();
    };

    cancelTask():boolean {
        if (!this.task) {
            return false;
        }

        cancelIdleCallback(this.task);
        return true;
    }
}
