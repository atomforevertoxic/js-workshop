/**
 * Custom Bind Implementation
 *
 * Creates a new function that, when called, has its `this` keyword set to
 * the provided context, with a given sequence of arguments preceding any
 * provided when the new function is called.
 *
 * @param {Function} fn - The function to bind
 * @param {*} context - The value to bind as `this`
 * @param {...*} boundArgs - Arguments to prepend to the bound function
 * @returns {Function} A new bound function
 */
function customBind(fn, context, ...boundArgs) {

  if (typeof fn !== 'function') throw new TypeError("fn is not a function");

  const boundFunction = function(...args){
    
    const fullArgs = [...boundArgs, ...args];
    
    const isCountructCall = this instanceof boundFunction;

    const contextToCall = isCountructCall ? this : context;

    return fn.apply(contextToCall, fullArgs);
  }

  if (fn.prototype){
    boundFunction.prototype = Object.create(fn.prototype);
  }


  return boundFunction;
}

/**
 * BONUS: Prototype Method Implementation
 *
 * Add customBind to Function.prototype so it can be called as:
 * myFunction.customBind(context, ...args)
 */

Function.prototype.customBind = function(context, ...boundArgs) {
  const fn = this;

  const boundFunction = function(...args){
    const fullArgs = [...boundArgs, ...args];

    isCountructCall = this instanceof boundFunction;

    const contextToCall = isCountructCall ? this : context;

    return fn.apply(contextToCall, fullArgs)
  }

  if (fn.prototype){
    boundFunction.prototype = Object.create(fn.prototype);
  }

  return boundFunction;
};

module.exports = { customBind };
