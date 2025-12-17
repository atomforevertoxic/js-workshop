/**
 * Promise.all Implementation
 *
 * Returns a promise that resolves when all promises resolve,
 * or rejects when any promise rejects.
 *
 * @param {Iterable} promises - An iterable of promises (or values)
 * @returns {Promise} A promise that resolves to an array of results
 */
function promiseAll(promises) {
  const promiseArray = Array.from(promises);

  if (promiseArray.length === 0) return Promise.resolve([])


  return new Promise((resolve, reject) => {

    const results = new Array(promiseArray.length);
    let resultsCount = 0;
    
    promiseArray.forEach((promise, index) => {
      Promise.resolve(promise)
        .then((value) => {
          results[index] = value;
      
          resultsCount++; 

          if (resultsCount === promiseArray.length){
            resolve(results);
          }
        })
        .catch((error) => {
          reject(error);
        })
    });
  });

}

/**
 * Promise.race Implementation
 *
 * Returns a promise that settles with the first promise to settle.
 *
 * @param {Iterable} promises - An iterable of promises (or values)
 * @returns {Promise} A promise that settles with the first result
 */
function promiseRace(promises) {

  const promiseArray = Array.from(promises);
  
  if (promiseArray.length === 0) return new Promise(() => {});

  return new Promise((resolve, reject) => {
    promiseArray.forEach((promise, index) => {
      Promise.resolve(promise)
        .then((value) => resolve(value))
        .catch((error) => reject(error));
    })
  });
}

/**
 * Promise.allSettled Implementation
 *
 * Returns a promise that resolves when all promises have settled.
 * Never rejects.
 *
 * @param {Iterable} promises - An iterable of promises (or values)
 * @returns {Promise} A promise that resolves to an array of settlement objects
 */
function promiseAllSettled(promises) {

  const promiseArray = Array.from(promises);

  if (promiseArray.length === 0) return Promise.resolve([]);

  return new Promise((resolve) => {

    const result = new Array(promiseArray.length);
    let settledCount = 0;

    promiseArray.forEach((promise, index) => {

      Promise.resolve(promise)
        .then((value) => {
          result[index] = { status: 'fulfilled', value: value}
        })
        .catch((reason) => {
          result[index] = {status: 'rejected', reason: reason}
        })
        .finally(() => {
          settledCount++;
          if (settledCount === promiseArray.length){
            resolve(result);
          }
        });
    })
  });
}

/**
 * Promise.any Implementation
 *
 * Returns a promise that resolves with the first fulfilled promise,
 * or rejects with an AggregateError if all reject.
 *
 * @param {Iterable} promises - An iterable of promises (or values)
 * @returns {Promise} A promise that resolves with the first fulfilled value
 */
function promiseAny(promises) {

  const promiseArray = Array.from(promises);

  if (promiseArray.length === 0) return Promise.reject(new AggregateError([], 'Cannot agregate empty array'));

  return new Promise((resolve, reject) => {

    const errors = new Array(promiseArray.length);
    let errorsCount = 0;

    let isResolved = false;
    promiseArray.forEach((promise, index) => {
      Promise.resolve(promise)
        .then((value) => {
          isResolved = true;
          resolve(value);

        })
        .catch((error) => {
          if (!isResolved){
            errors[index] = error;
            errorsCount++;

            if (errorsCount === promiseArray.length){
              reject(new AggregateError(errors, 'All promises were rejected'));
            }
          }
        })
    });
  });
}

module.exports = { promiseAll, promiseRace, promiseAllSettled, promiseAny };
