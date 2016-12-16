// @flow

import Mapable from '../../src/Mapable';
import ForEachable from '../../src/ForEachable';

const worker = new Mapable();
const anotherWorker = new ForEachable();

worker
    .map(e => e * 2)
    .pipe(anotherWorker)
    .forEach(e => console.log(e));

worker
    .take(10)
    .then(result => console.log(result));

new Array(100).fill(0).forEach((_, i) => worker.enqueue(i));
