const { run } = require("jest");

/**
 * Async Queue Implementation
 *
 * A queue that processes async tasks with concurrency control.
 */
class AsyncQueue {
  /**
   * Create an async queue
   * @param {Object} options - Queue options
   * @param {number} [options.concurrency=1] - Maximum concurrent tasks
   * @param {boolean} [options.autoStart=true] - Start processing immediately
   */
  constructor(options = {}) {

    this.concurrency = options.concurrency || 1;
    this.autoStart = options.autoStart !== false;

    this.queue = [];        // Pending tasks
    this.running = 0;       // Currently running count
    this.paused = false;    // Paused state
    this.emptyCallbacks = []; // Callbacks for empty event
  }

  /**
   * Add a task to the queue
   * @param {Function} task - Async function to execute
   * @param {Object} [options] - Task options
   * @param {number} [options.priority=0] - Task priority (higher = sooner)
   * @returns {Promise} Resolves when task completes
   */
  add(task, options = {}) {
    
    return new Promise((resolve, reject) => {
      const priority = options.priority || 0;
      
      const taskEntry = {task, priority, resolve, reject};

      this.queue.push(taskEntry);
      this.queue.sort((taskA, taskB) => taskB.priority - taskA.priority);

      if (this.autoStart && !this.paused){
        this._process();
      }
    });
  }

  /**
   * Start processing the queue
   */
  start() {
    this.paused = false;
    this._process();
  }

  /**
   * Pause the queue (running tasks will complete)
   */
  pause() {
    this.paused = true;
  }

  /**
   * Clear all pending tasks
   */
  clear() {
    this.queue = [];
  }

  /**
   * Register callback for when queue becomes empty
   * @param {Function} callback - Called when queue is empty
   */
  onEmpty(callback) {
    if (typeof callback === 'function'){
      this.emptyCallbacks.push(callback);
    }
  }

  /**
   * Number of pending tasks
   * @returns {number}
   */
  get size() {
    return this.queue.length;
  }

  /**
   * Number of currently running tasks
   * @returns {number}
   */
  get pending() {
    return this.running;
  }

  /**
   * Whether queue is paused
   * @returns {boolean}
   */
  get isPaused() {
    return this.paused;
  }

  /**
   * Internal: Process next tasks from queue
   * @private
   */
  _process() {

    while (!this.paused && this.running < this.concurrency && this.queue.length > 0){
      
      const taskEntry = this.queue.shift();
      
      this.running++;

      Promise.resolve()
        .then(() => taskEntry.task())
        .then(result => taskEntry.resolve(result))
        .catch(error => taskEntry.reject(error))
        .finally(() => {
          this.running--;
          this._process();
          this._checkEmpty();
        })
    }
  }

  /**
   * Internal: Check and trigger empty callbacks
   * @private
   */
  _checkEmpty() {
    if (this.queue.length === 0 && !this.running){
      
      this.emptyCallbacks.forEach((callback) => {
        try{
          callback();
        }
        catch(error){
          console.error('Error in empty callback:', error);
        }
      });

    }
  }
}

module.exports = { AsyncQueue };
