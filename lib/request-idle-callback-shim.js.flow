// @flow

export type Deadline = {
    didTimeout: boolean,
    timeRemaining(): number
}

const requestIdleCallbackShim = (cb:(item:Deadline) => any) => {
    const start = Date.now();

    return setTimeout(() => {
        cb({
            didTimeout: false,
            timeRemaining: () => Math.max(0, 50 - (Date.now() - start))
        });
    }, 1);
};

const cancelIdleCallbackShim = (id:number) => clearTimeout(id);

window.requestIdleCallback = window.requestIdleCallback || requestIdleCallbackShim;
window.cancelIdleCallback = window.cancelIdleCallback || cancelIdleCallbackShim;

export const requestIdleCallback = window.requestIdleCallback;
export const cancelIdleCallback = window.cancelIdleCallback;
