/**
 * Proxy Pattern Implementation
 */

/**
 * Create a validating proxy
 *
 * @param {Object} target - Target object
 * @param {Object} validators - Map of property name to validator function
 * @returns {Proxy} Proxy that validates on set
 */
function createValidatingProxy(target, validators) {
  return new Proxy(target, {
    set(obj, prop, value) {

      const validator = validators[prop];

      if (validator && !validator(value)) throw new Error('Invalid value for this prop');

      obj[prop] = value;
      return true;
    },

    get(obj, prop) {
      return obj[prop];
    },
  });
}

/**
 * Create a logging proxy
 *
 * @param {Object} target - Target object
 * @param {Function} logger - Logging function (action, prop, value) => void
 * @returns {Proxy} Proxy that logs all operations
 */
function createLoggingProxy(target, logger) {

  return new Proxy(target, {
    get(obj, prop) {
      logger('get', prop, obj[prop]);
      return obj[prop];
    },

    set(obj, prop, value) {
      logger('set', prop, value);
      obj[prop] = value;
      return true;
    },

    deleteProperty(obj, prop) {
      logger('delete', prop, undefined);
      delete(obj[prop]);
      return true;
    },

    has(obj, prop) {
      logger('has', prop, undefined);
      return prop in obj;
    },
  });
}

/**
 * Create a caching proxy for methods
 *
 * @param {Object} target - Target object with methods
 * @param {string[]} methodNames - Names of methods to cache
 * @returns {Proxy} Proxy that caches method results
 */
function createCachingProxy(target, methodNames) {
  
  const cache = new Map();

  return new Proxy(target, {
    get(obj, prop) {

      if (methodNames.includes(prop) && typeof obj[prop] === 'function'){
        return function(...args){
          const key = JSON.stringify(args);

          if (cache.has(key)){
            return cache.get(key);
          }

          const value = obj[prop](...args);
          cache.set(key, value);

          return value;
        }
      }

      return obj[prop];
    },
  });
}

/**
 * Create an access control proxy
 *
 * @param {Object} target - Target object
 * @param {Object} permissions - Access permissions
 * @param {string[]} permissions.readable - Properties that can be read
 * @param {string[]} permissions.writable - Properties that can be written
 * @returns {Proxy} Proxy that enforces access control
 */
function createAccessProxy(target, permissions) {

  const { readable = [], writable = [] } = permissions;

  return new Proxy(target, {
    get(obj, prop) {
      if (readable.includes(prop)){
        return obj[prop];
      }
      throw new Error(`${prop} is not readable`);
    },

    set(obj, prop, value) {
      if (writable.includes(prop)){
        obj[prop] = value;
        return true;
      }
      throw new Error(`${prop} is not writable`);
    },

    deleteProperty(obj, prop) {
      if (writable.includes(prop)){
        delete(obj[prop]);
        return true;
      }
      return false;
    },
  });
}

/**
 * Create a lazy loading proxy
 *
 * @param {Function} loader - Function that returns the real object
 * @returns {Proxy} Proxy that loads object on first access
 */
function createLazyProxy(loader) {

  let instance = null;
  let loaded = false;

  return new Proxy(
    {},
    {
      get(obj, prop) {
        if (!loaded){
          instance = loader();
          loaded = true;
        }
        return instance[prop];
      },

      set(obj, prop, value) {
        if (!loaded){
          instance = loader();
          loaded = true;
        }
        instance[prop] = value;
        return true;
      },
    },
  );
}

/**
 * Create an observable proxy
 *
 * @param {Object} target - Target object
 * @param {Function} onChange - Callback when property changes
 * @returns {Proxy} Proxy that notifies on changes
 */
function createObservableProxy(target, onChange) {

  return new Proxy(target, {
    set(obj, prop, value) {
      const oldValue = obj[prop];
      onChange(prop, value, oldValue);
      obj[prop] = value;
      return true;
    },

    deleteProperty(obj, prop) {
      const oldValue = obj[prop];
      delete(obj[prop]);
      onChange(prop, undefined, oldValue);
      return true;
    },
  });
}

module.exports = {
  createValidatingProxy,
  createLoggingProxy,
  createCachingProxy,
  createAccessProxy,
  createLazyProxy,
  createObservableProxy,
};
