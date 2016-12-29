// @flow

export type Deadline = {
    didTimeout: boolean,
    timeRemaining(): number
}

const hasSupport = typeof window !== 'undefined' && window.hasOwnProperty('requestIdleCallback');
const hasSetImmediate = typeof global !== 'undefined' && global.hasOwnProperty('setImmediate');

const requestIdleCallbackShim = (cb:(item:Deadline) => any) => {
    const start = Date.now();
    const timer = hasSetImmediate ? global.setImmediate : setTimeout;

    return timer(() => cb({
        didTimeout: false,
        timeRemaining: () => Math.max(0, 50 - (Date.now() - start))
    }));
};

const cancelIdleCallbackShim = (id:any) => {
    const cancellator = hasSetImmediate ? global.clearImmediate : clearTimeout;
    cancellator(id);
};

export const requestIdleCallback = hasSupport ? window.requestIdleCallback : requestIdleCallbackShim;
export const cancelIdleCallback = hasSupport ? window.cancelIdleCallback : cancelIdleCallbackShim;
