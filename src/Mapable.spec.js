const ForEachable = require('./ForEachable').default;
const Mapable = require('./Mapable').default;
const QueueWorker = require('./QueueWorker').default;

jest.useFakeTimers();

describe('Mapable', () => {
  it('should contains queue worker instance inside', () => {
    const instance = new Mapable();

    expect(instance.worker).toBeInstanceOf(QueueWorker);
  });

  it('should correct map the given count of queued data (.take)', () => {
    const instance = new Mapable();
    const callback = jest.fn();

    instance
        .map(i => i * 2)
        .take(5)
        .then(result => expect(result).toEqual([0, 2, 4, 6, 8]))

    const testData = Array(5).fill(0).map((_, i) => i);

    testData.forEach(i => instance.enqueue(i));

    jest.runAllTimers();
  });

  it('should correct map the queued data util given predicate (.takeUntil)',() => {
    const instance = new Mapable();

    instance
        .map(i => i * 2)
        .takeUntil(i => i > 5)
        .then(result => expect(result).toEqual([0, 2, 4, 6]))

    const testData = Array(10).fill(0).map((_, i) => i);

    testData.forEach(i => instance.enqueue(i));

    jest.runAllTimers();
  });

  it('should correct pipe the dequeued data to selected queue',() => {
    const instance = new Mapable();
    const anotherWorker = new ForEachable();
    const callback = jest.fn();
    const mapFn = i => i * 2;

    instance
        .map(mapFn)
        .pipe(anotherWorker)
        .forEach(callback)

    instance.take(5);

    const testData = Array(5).fill(0).map((_, i) => i);

    testData.forEach(i => instance.enqueue(i));

    jest.runAllTimers();

    expect(callback.mock.calls.length).toBe(5);
    callback.mock.calls.forEach((call, i) => expect(call[0]).toBe(mapFn(testData[i])));
  });
});