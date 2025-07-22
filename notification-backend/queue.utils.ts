type Task<T = any> = () => Promise<T> | T;

export class ConcurrentQueue {
  private concurrency: number;
  private running: number = 0;
  private queue: Array<() => void> = [];
  private onEmpty: () => void;

  constructor(concurrency: number = 1, onEmpty: () => void) {
    this.concurrency = concurrency;
    this.onEmpty = onEmpty;
  }

  add<T>(task: Task<T>): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      const runTask = () => {
        this.running++;
        Promise.resolve()
          .then(task)
          .then((result) => {
            resolve(result);
          })
          .catch((err) => {
            reject(err);
          })
          .finally(() => {
            this.running--;
            this.next();
          });
      };

      if (this.running < this.concurrency) {
        runTask();
      } else {
        this.queue.push(runTask);
      }
    });
  }

  private next() {
    if (this.queue.length > 0 && this.running < this.concurrency) {
      const nextTask = this.queue.shift();
      if (nextTask) nextTask();
    } else {
      this.onEmpty();
    }
  }

  get size() {
    return this.queue.length;
  }
}
