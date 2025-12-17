/**
 * Memoization Implementation
 *
 * Creates a memoized version of a function that caches results based on arguments.
 *
 * @param {Function} fn - The function to memoize
 * @param {Object} [options] - Optional configuration
 * @param {number} [options.maxSize] - Maximum number of cached entries
 * @param {number} [options.ttl] - Time-to-live for cache entries in milliseconds
 * @param {Function} [options.keyGenerator] - Custom function to generate cache keys
 * @returns {Function} Memoized function with cache control methods
 */
function memoize(fn, options = {}) {
  
  const { maxSize = Infinity, ttl = Infinity, keyGenerator = null } = options;

  const cache = new Map();

  const generator = keyGenerator || ((...args) => JSON.stringify(args)); 

  const memoized = function(...args){
    const cacheKey = generator(args);

    if (cache.has(cacheKey)){

      const entry = cache.get(cacheKey);

      let isExpired = ttl !== Infinity && (Date.now() - entry.timestamp) > ttl;

      if (!isExpired){
        return entry.value;
      }

      cache.delete(cacheKey);
    }

    const result = fn.apply(this, args);

      
    cache.set(cacheKey, {
      value: result,
      timestamp: Date.now()
    });
      

    if (cache.size > maxSize){
      const firstKey = cache.keys().next().value;
      cache.delete(firstKey);
    }

    return result;
  }

  memoized.cache = {
    clear: () => cache.clear(),
    delete: (...args) => cache.delete(generator(args)),
    has: (...args) => cache.has(generator(args)),
    get size() { return cache.size; }
  };

  return memoized;
}

module.exports = { memoize };
