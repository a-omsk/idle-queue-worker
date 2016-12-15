#IdleQueueWorker

Simple async queue implementation for low priority background tasks, such as analytics sending, data collecting.

Queue processing implemented over [window.requestIdleCallback](https://developer.mozilla.org/en-US/docs/Web/API/Window/requestIdleCallback) (shim included) that provides task processing on the main event loop, without impacting latency-critical events.



## Installation

 1. ```npm install --save idle-queue-worker```
 2. Use with your favorite module bundler such (e.g. Webpack, Browserify, etc)



## Documentation
Module provides a few interfaces: ```ForEachable```, ```Mapable```, ```Foldable```.
If you want to create your own interface, use ```BaseQueueWorker``` and object composition concept.

For lot of cases you just need only two methods:


`forEach` → for  dequeued data processing

`enqueue` → for passing some data to the queue.



##API

**`BaseQueueWorker<T>(isReady?:() => boolean, timeout?:number, queue?:Array<T>)`**

Params ( aka *baseQueueWorkerArgs*):

 - `isReady` — call before each attempt of queue item processing. If result is falsy, then next new work will be sheduled.
 -  `timeout (given in ms)` — minimum time that must pass before calling the callback function.
 - ```queue``` — not recommended for use in real tasks. Only for testing usage.

Methods:
 
- ```.register(callback: (item:T) => any):void``` — callback function for queue processing.
- ```.enqueue(item:T):void``` — add item at the end of the queue.

Example:
```javascript
import { BaseQueueWorker } from 'idle-queue-worker/lib';

const worker = new BaseQueueWorker();

worker.register(x => x * x);
worker.enqueue(2);
```



**ForEachable(...baseQueueWorkerArgs)<T>**

Methods:

 - ```.forEach(callback: (item:T) => any):void``` — just forEach
   callback function
 - ```.enqueue(item:T):void``` — proxy of baseQueueWorker method
 - ```.pipe(queue:AnotherQueue):AnotherQueue``` — enqueue result of map
   function to next queue

Example:
```javascript
import { ForEachable } from 'idle-queue-worker/lib';

const worker = new ForEachable();

worker.forEach(x => x * x);
```



**Mapable(...baseQueueWorkerArgs)<T,R>**

Methods:

- ```.map(callback: (item:T) => R):Self``` — a → b callback function
- ```.enqueue(item:T):void``` — proxy of baseQueueWorker method
- ```.pipe(queue:AnotherQueue):AnotherQueue``` — enqueue result of map function to next queue
- ```.take(count:number).Promise<Array<R>>``` — take first N processed items of queue
- ```.takeUntil(predicate:(item:R) => boolean):Promise<Array<R>>``` — collect data until predicate result is falsy, then resolve result

Example:
```javascript
import { Mapable } from 'idle-queue-worker/lib';

const worker = new Mapable();

worker
	.map(x => x * x)
	.take(10)
	.then(result => send(result));
```



**Foldable(...baseQueueWorkerArgs)<T,R>**

Methods:

- ```.enqueue(item:T):void``` — proxy of baseQueueWorker method
- ```.pipe(queue:AnotherQueue):AnotherQueue``` — enqueue result of map function to next queue
- ```.fold(callback:(accumulator:R, item:T) => R, initialValue:R):Self``` — just another fold function
- ```.take(count:number).Promise<Array<R>>``` — take first N processed items of queue

Example:

```javascript
import { Foldable } from 'idle-queue-worker/lib';

const worker = new Foldable();

worker
	.fold((sum, value) => sum * value, 1)
	.take(10)
	.then(result => send(result));
```



##TODO

 - Node  support
 - Tests
 - Live examples
 - A lot of improvements!

