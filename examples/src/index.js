import { ForEachable, Mapable, Foldable } from '../../src';

const mapableWorker = new Mapable();
const foreachableWorker = new ForEachable();
const foldableWorker = new Foldable();

mapableWorker
    .map(e => e * 2)
    .pipe(foreachableWorker)
    .forEach(e => console.log(e));

mapableWorker
    .take(5)
    .then(result => console.log(result));

foldableWorker
    .fold((result, element) => result + element, 0)
    .pipe(foreachableWorker);

foldableWorker
    .foldUntil(result => result > 10)
    .then(result => console.log('DONE'))

new Array(5).fill(0).forEach((_, i) => mapableWorker.enqueue(i));
[1, 5, 2, 1, 5].forEach(number => foldableWorker.enqueue(number));
