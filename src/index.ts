type SetIntervalMessage = {
  delay: number;
  timerId: number;
  type: 'setInterval' | 'setTimeout';
};
type ClearTimerMessage = {
  timerId: number;
  type: 'clearInterval' | 'clearTimeout';
};
type ToWorkerMessage = SetIntervalMessage | ClearTimerMessage;
type TimerCallMessage = {
  timerId: number;
};
interface TimerWorker extends Worker {
  postMessage: (data: ToWorkerMessage) => void;
}
type Timer = {
  callback: () => void;
};

const workerCallback = () => {
  const workerTimers = new Map<number, number>();
  addEventListener('message', ({ data }: { data: ToWorkerMessage }) => {
    if (data.type === 'setInterval' || data.type === 'setTimeout') {
      workerTimers.set(
        data.timerId,
        self[data.type](() => postMessage({ timerId: data.timerId }), data.delay),
      );
      return;
    }

    if (workerTimers.has(data.timerId) && (data.type === 'clearInterval' || data.type === 'clearTimeout')) {
      self[data.type](workerTimers.get(data.timerId));
      workerTimers.delete(data.timerId);
    }
  });
};

const timers = new Map<number, Timer>();
let lastTimerId = 0;

const worker: TimerWorker = new Worker(
  URL.createObjectURL(new Blob([`(${workerCallback}).call(self);`], { type: 'text/javascript' })),
);

worker.addEventListener('message', ({ data }: { data: TimerCallMessage }) => {
  const timer = timers.get(data.timerId);
  if (timer === undefined) {
    return;
  }
  timer.callback();
});

const setTimer = (type: 'setInterval' | 'setTimeout', callback: () => void, delay: number): number => {
  const timerId = ++lastTimerId;
  timers.set(timerId, { callback });
  worker.postMessage({ delay, timerId, type });
  return timerId;
};

const clearTimer = (type: 'clearInterval' | 'clearTimeout', timerId: number): void => {
  worker.postMessage({ timerId, type });
  timers.delete(timerId);
};

export const setInterval = (callback: () => void, delay: number): number => setTimer('setInterval', callback, delay);
export const setTimeout = (callback: () => void, delay: number): number => setTimer('setTimeout', callback, delay);

export const clearInterval = (timerId: number) => clearTimer('clearInterval', timerId);
export const clearTimeout = (timerId: number) => clearTimer('clearTimeout', timerId);
