#IdleQueueWorker

**(WARNING! Still experimental library!)**

Simple async queue implementation for low priority background tasks, such as analytics sending, data collecting.

Queue processing implemented over [window.requestIdleCallback](https://developer.mozilla.org/en-US/docs/Web/API/Window/requestIdleCallback) (shim included) that provides task processing on the main event loop, without impacting latency-critical events.

This module has no any external dependencies and some part  of code base already used in production, enjoy.



## Installation

 1. ```npm install --save idle-queue-worker```
 2. Use with your favorite module bundler such (e.g. Webpack, Browserify, etc)



## Documentation
Module provides a few interfaces: ```ForEachable```, ```Mapable```, ```Foldable```.
If you want to create your own interface, use ```QueueWorker``` and object composition concept.

For lot of cases you just need ```ForEachable``` interface and only two methods:


`forEach` → for  dequeued data processing

`enqueue` → for passing some data to the queue.



##API

**`QueueWorker<T>(isReady?:() => boolean, timeout?:number, queue?:Array<T>)`**

Params ( aka *queueWorkerArgs*):

 - `isReady` — call before each attempt of queue item processing. If result is falsy, then next new work will be sheduled.
 -  `timeout (given in ms)` — minimum time that must pass before calling the callback function.
 - ```queue``` — not recommended for use in real tasks. Only for testing usage.

Methods:
 
- ```.register(callback: (item:T) => any):void``` — callback function for queue processing.
- ```.enqueue(item:T):void``` — add item at the end of the queue.

Example:
```javascript
import { QueueWorker } from 'idle-queue-worker/lib';

const worker = new QueueWorker();

worker.register(x => x * x);
worker.enqueue(2);
```

**`Abstract(...queueWorkerArgs)<T,R>`**

Methods:
 - ```.enqueue(item:T):void``` — proxy of queueWorker method
 - ```.pipe(queue:AnotherQueue):AnotherQueue``` — enqueue result of callback function to next queue

You can't construct Abstact instance directly, use classes below.

**`ForEachable(...queueWorkerArgs)<T>`**

Methods:

 - ```.forEach(callback: (item:T) => any):void``` — callback function applied for each dequeued element

Example:
```javascript
import { ForEachable } from 'idle-queue-worker/lib';

const worker = new ForEachable();

worker.forEach(x => x * x);
```



**`Mapable(...queueWorkerArgs)<T,R>`**

Methods:

- ```.map(callback: (item:T) => R):Self``` — a → b callback function
- ```.take(count:number):Promise<Array<R>>``` — take first N processed items of queue
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



**`Foldable(...queueWorkerArgs)<T,R>`**

Methods:

- ```.fold(callback:(accumulator:R, item:T) => R, initialValue:R):Self``` — same as Array.prototype.reduce function
- ```.foldUntil(count:number):Promise<R>``` — foldResult until predicate falsy

Example:

```javascript
import { Foldable } from 'idle-queue-worker/lib';

const worker = new Foldable();

worker
	.fold((sum, value) => sum * value, 1)
	.foldUntil(sum => sum > 10)
	.then(result => send(result));
```

**Piping**:

You can pass the results of one queue to next queue just call .pipe method of ```ForEachable```, ```Mapable```, ```Foldable``` instances. There is many  opportunities to determine your data flow with queues without pain.

Example:

```javascript
import { ForEachable, Mapable, Foldable } from 'idle-queue-worker/lib';

const mapableWorker = new Mapable();
const forEachableWorker = new ForEachable();
const foldableWorker = new Foldable();

foldableWorker
    .fold((result, element) => result + element, 0)
    .foldUntil(result => result > 10)

mapableWorker
    .map(e => e * 2)
    .pipe(foldableWorker)
    .pipe(forEachableWorker)
    .forEach(e => console.log(e));

mapableWorker
    .take(5)
    .then(result => console.log('DONE!'));
```



##TODO
 - Live examples
 - A lot of improvements!
