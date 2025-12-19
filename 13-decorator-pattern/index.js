/**
 * Decorator Pattern Implementation
 */

/**
 * Logging Decorator
 *
 * Wraps a function to log its calls and return values.
 *
 * @param {Function} fn - Function to decorate
 * @returns {Function} Decorated function
 */
function withLogging(fn) {
  return function(...args) {

  console.log(`Function name: ${fn.name}\nFunction arguments: ${args}`);

  const result = fn.apply(this, args);

  console.log("Return value: " + result)

  return result;

  }
}

/**
 * Timing Decorator
 *
 * Wraps a function to measure and log execution time.
 *
 * @param {Function} fn - Function to decorate
 * @returns {Function} Decorated function
 */
function withTiming(fn) {

  return function(...args){

    const startTime = Date.now();
    
    const result = fn.apply(this, args);

    const duration = Date.now() - startTime;
    console.log("Duration of function call is " + duration);

    return result;
  }
}

/**
 * Retry Decorator
 *
 * Wraps a function to retry on failure.
 *
 * @param {Function} fn - Function to decorate
 * @param {number} maxRetries - Maximum retry attempts
 * @returns {Function} Decorated function
 */
function withRetry(fn, maxRetries = 3) {

  return function(...args){

    let lastError = null;

    for (let attempt = 0; attempt <= maxRetries; attempt++){
      try{
        return fn.apply(this, args);
      }
      catch(error){
        lastError = error;
      }
    }
    throw new Error("Cannot apply function because of " + lastError.message);
  }
}

/**
 * Memoize Decorator
 *
 * Wraps a function to cache results based on arguments.
 *
 * @param {Function} fn - Function to decorate
 * @returns {Function} Decorated function with cache
 */
function withMemoize(fn) {

  const cache = new Map();

  return function(...args){

    const key = JSON.stringify(args);

    if (cache.has(key)){
      return cache.get(key);
    }

    const value = fn.apply(this, args);
    cache.set(key, value);

    return value;
  }
}

/**
 * Validation Decorator
 *
 * Wraps a function to validate arguments before calling.
 *
 * @param {Function} fn - Function to decorate
 * @param {Function} validator - Validation function (returns boolean)
 * @returns {Function} Decorated function
 */
function withValidation(fn, validator) {

  return function(...args){

    if (validator && typeof validator === 'function'){
      
      const isValid = validator(...args);
    
      if (isValid){
        return fn.apply(this, args);
      }

      throw new Error("Args are not valid");
    }
  }
}

/**
 * Cache Object Method Decorator
 *
 * Decorates an object method to cache its results.
 *
 * @param {Object} obj - Object containing the method
 * @param {string} methodName - Name of method to cache
 * @returns {Object} Object with cached method
 */
function withCache(obj, methodName) {

  const originalMethod = obj[methodName];
  const cache = new Map()

  obj[methodName] = function(...args){

    const key = JSON.stringify(args);

    if (cache.has(key)){
      return cache.get(key); 
    }

    const value = originalMethod.apply(this, args);
    cache.set(key, value);

    return value;
  }

  return obj;

}

/**
 * Compose Decorators
 *
 * Composes multiple decorators into one.
 * Decorators are applied right-to-left.
 *
 * @param {...Function} decorators - Decorator functions
 * @returns {Function} Composed decorator
 */
function compose(...decorators) {

  return function(fn){
    return decorators.reduceRight((currentFn, decorator) => {
      return decorator(currentFn);
    }, fn)
  }
}

/**
 * Pipe Decorators
 *
 * Like compose but applies left-to-right.
 *
 * @param {...Function} decorators - Decorator functions
 * @returns {Function} Piped decorator
 */
function pipe(...decorators) {
  return function(fn){
    return decorators.reduce((currentFn, decorator) => {
      return decorator(currentFn);
    }, fn)
  }
}

// Storage for logs (used in tests)
const logs = [];

function log(message) {
  logs.push(message);
  console.log(message); // Uncomment for debugging
}

function clearLogs() {
  logs.length = 0;
}

function getLogs() {
  return [...logs];
}

module.exports = {
  withLogging,
  withTiming,
  withRetry,
  withMemoize,
  withValidation,
  withCache,
  compose,
  pipe,
  log,
  clearLogs,
  getLogs,
};
