/**
 * Debounce Implementation
 *
 * Creates a debounced function that delays invoking `fn` until after `delay`
 * milliseconds have elapsed since the last time the debounced function was called.
 *
 * @param {Function} fn - The function to debounce
 * @param {number} delay - The delay in milliseconds
 * @returns {Function} The debounced function with a cancel() method
 */
function debounce(fn, delay) {
  // TODO: Implement debounce

  let timeoutId = null;

  function debounced(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  }

  debounced.cancel = function(){
    clearTimeout(timeoutId);
    timeoutId = null;
  }

  return debounced;
}

/**
 * Throttle Implementation
 *
 * Creates a throttled function that only invokes `fn` at most once per
 * every `limit` milliseconds.
 *
 * @param {Function} fn - The function to throttle
 * @param {number} limit - The time limit in milliseconds
 * @returns {Function} The throttled function with a cancel() method
 */
function throttle(fn, limit) {

  let inTrottle = false;
  let timeoutId = null;
  
  function trottled(...args){
    if (!inTrottle){
      fn.apply(this, args);
      inTrottle = true;
      
      setTimeout(()=> inTrottle = false, limit);
    }
  }

  trottled.cancel = function(){
    clearTimeout(timeoutId);
    inTrottle = false;
    timeoutId = null;
  }

  return trottled;
}

module.exports = { debounce, throttle };
