/**
 * Observable Implementation
 *
 * A simple Observable for reactive data streams.
 */
class Observable {
  /**
   * Create an Observable
   * @param {Function} subscribeFn - Function called with subscriber on subscribe
   */
  constructor(subscribeFn) {
    this._subscribeFn = subscribeFn;
  }

  /**
   * Subscribe to the Observable
   * @param {Object|Function} observer - Observer object or next callback
   * @returns {Object} Subscription with unsubscribe method
   */
  subscribe(observer) {
    if (typeof observer === 'function') observer = {next: observer};

    let isCompleted = false;
    let isError = false;
    let isUnsubscribed = false; 

    let subscriber = {
      next : (value) => {
        if (!isCompleted && !isError && !isUnsubscribed){
          observer.next?.(value)
        }
      },
      error: (error) => {
        isError = true;
        observer.error?.(error)
      },
      complete: () => {
        if (!isCompleted && !isError){
          isCompleted = true;
          observer.complete?.();
        }
      }
    }

    const cleanupFn = this._subscribeFn(subscriber);

    return {
      unsubscribe: () => {
        isUnsubscribed = true;
        if (cleanupFn && typeof cleanupFn === 'function'){
          cleanupFn();
        }
      }
    }
  }

  /**
   * Transform each emitted value
   * @param {Function} fn - Transform function
   * @returns {Observable} New Observable with transformed values
   */
  map(fn) {
    return new Observable((subscriber) => {
      const subscription = this.subscribe({
        next: (value) => {
          const result = fn(value);
          subscriber.next(result);
        },
        error: (error) => subscriber.error(error),
        complete: () => subscriber.complete() 
      });

      return () => subscription.unsubscribe();
    }); 
  }

  /**
   * Filter emitted values
   * @param {Function} predicate - Filter function
   * @returns {Observable} New Observable with filtered values
   */
  filter(predicate) {
    return new Observable((subscriber) => {
      const subscription = this.subscribe({
        next: (value) => {
          const result = predicate(value);
          if (result === true){
            subscriber.next(value);
          }
        },
        error: error => subscriber.error(error),
        complete: () => subscriber.complete()
      });

      return () => subscription.unsubscribe();
    }); 
  }

  /**
   * Take only first n values
   * @param {number} count - Number of values to take
   * @returns {Observable} New Observable limited to count values
   */
  take(count) {

    return new Observable((subscriber) => {
      let valueLeft = count;
      const subscription = this.subscribe({
        next: (value) => {
          if (valueLeft!=0){
            valueLeft--;
            subscriber.next(value);
          }
          else subscriber.complete();
        },
        error: error => subscriber.error(error),
        complete: () => subscriber.complete()
      });

      return () => subscription.unsubscribe();
    });
  }

  /**
   * Skip first n values
   * @param {number} count - Number of values to skip
   * @returns {Observable} New Observable that skips first count values
   */
  skip(count) {

    return new Observable((subscriber) => {
      let skipLeft = count;
      const subscription = this.subscribe({
        next: (value) => {
          if (skipLeft<=0){
            subscriber.next(value);
          }
          else skipLeft--;
        },
        error: error => subscriber.error(error),
        complete: () => subscriber.complete()
      });

      return () => subscription.unsubscribe();
    }); 
  }

  /**
   * Create Observable from array
   * @param {Array} array - Array of values
   * @returns {Observable} Observable that emits array values
   */
  static from(array) {
    return new Observable((subscriber) => {
      array.forEach((element) => {
        subscriber.next(element);
      })
      subscriber.complete();
    });
  }

  /**
   * Create Observable from single value
   * @param {*} value - Value to emit
   * @returns {Observable} Observable that emits single value
   */
  static of(...values) {
    return Observable.from(values);
  }
}

module.exports = { Observable };
