/**
 * Deep Clone Implementation
 *
 * Create a deep copy of any JavaScript value, including nested objects,
 * arrays, and special types like Date, RegExp, Map, and Set.
 *
 * @param {*} value - The value to clone
 * @param {WeakMap} [visited] - WeakMap to track circular references (used internally)
 * @returns {*} A deep clone of the input value
 */
function deepClone(value, visited = new WeakMap()) {
  // TODO: Implement deep cloning

  const primitives = ['number', 'string', 'boolean', 'symbol', 'bigint'];

  if (value == null || primitives.includes(typeof value)) return value;

  else if (visited.has(value)) return visited.get(value);

  else if (value instanceof Date) {
    const clone =  new Date(value.getTime());
    visited.set(value, clone);
    return clone;
  }

  else if (value instanceof RegExp){
    const clone =  new RegExp(value.source, value.flags);
    visited.set(value, clone);
    return clone;
  } 

  else if (value instanceof Map){
    const clone = new Map();
    visited.set(value, clone);
    value.forEach((val, key) => {
      clone.set(deepClone(key, visited), deepClone(val, visited));
    });
    return clone;
  } 

  else if (value instanceof Set){
    const clone = new Set();
    visited.set(value, clone);
    value.forEach((val) => clone.add(deepClone(val, visited)));
    return clone;
  }

  else if (Array.isArray(value)){
    const clone = [];
    visited.set(value, clone);
    value.forEach((val) => clone.push(deepClone(val, visited)));
    return clone;
  }

  const clone = Object.create(Object.getPrototypeOf(value));

  visited.set(value, clone);

  const properties = [
    ...Object.getOwnPropertyNames(value),
    ...Object.getOwnPropertySymbols(value)
  ]

  for (const property of properties){
    const descriptor = Object.getOwnPropertyDescriptor(value, property);

    if('value' in descriptor){
      descriptor.value = deepClone(descriptor.value, visited);
    }

    Object.defineProperty(clone, property, descriptor);

  }

  return clone;
}

module.exports = { deepClone };
