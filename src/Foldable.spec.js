const ForEachable = require('./ForEachable').default;
const Foldable = require('./Foldable').default;
const QueueWorker = require('./QueueWorker').default;

jest.useFakeTimers();

describe('Foldable', () => {
  it('should contains queue worker instance inside', () => {
    const instance = new Foldable();

    expect(instance.worker).toBeInstanceOf(QueueWorker);
  });

  it('should correct fold the queued data util given predicate (.foldUntil)',() => {
    const instance = new Foldable();

    instance
        .fold((accumulator, value) => accumulator + value, 0)
        .foldUntil(i => i > 14)
        .then(result => expect(result).toEqual(15))

    const testData = Array(10).fill(0).map((_, i) => i);

    testData.forEach(i => instance.enqueue(i));

    jest.runAllTimers();
  });

  it('should correct pipe the dequeued data to selected queue',() => {
    const instance = new Foldable();
    const anotherWorker = new ForEachable();
    const callback = jest.fn();

    instance
        .fold((accumulator, value) => accumulator + value, 0)
        .pipe(anotherWorker)
        .forEach(callback)

    instance
        .foldUntil(i => i > 14);


    const testData = Array(5).fill(0).map((_, i) => i);

    testData.forEach(i => instance.enqueue(i));

    jest.runAllTimers();

    expect(callback.mock.calls.length).toBe(5);
  });
});