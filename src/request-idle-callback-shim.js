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

const hasSupport = typeof window !== 'undefined' && window.hasOwnProperty('requestIdleCallback');

export const requestIdleCallback = hasSupport ? window.requestIdleCallback : requestIdleCallbackShim;
export const cancelIdleCallback = hasSupport ? window.cancelIdleCallback : cancelIdleCallbackShim;
