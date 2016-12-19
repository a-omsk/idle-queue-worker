const ForEachable = require('./ForEachable').default;
const QueueWorker = require('./QueueWorker').default;

jest.useFakeTimers();

describe('ForEachable', () => {
  it('should contains queue worker instance inside', () => {
    const instance = new ForEachable();

    expect(instance.worker).toBeInstanceOf(QueueWorker);
  });

  it('should apply callback function for each processed element', () => {
    const instance = new ForEachable();
    const callback = jest.fn();

    instance.forEach(callback);

    const testData = Array(5).fill(0).map((_, i) => i);

    testData.forEach(i => instance.enqueue(i));

    jest.runAllTimers();

    expect(callback.mock.calls.length).toBe(5);

    callback.mock.calls.forEach((call, i) => expect(call[0]).toBe(testData[i]));
  });
});