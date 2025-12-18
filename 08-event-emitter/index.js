/**
 * Event Emitter Implementation
 *
 * A pub/sub event system similar to Node.js EventEmitter.
 */
class EventEmitter {
  constructor() {
    this.events = new Map();
  }

  /**
   * Register a listener for an event
   * @param {string} event - Event name
   * @param {Function} listener - Callback function
   * @returns {EventEmitter} this (for chaining)
   */
  on(event, listener) {

    if (!this.events.get(event)) this.events.set(event, []);

    const listeners = this.events.get(event)

    listeners.push(listener);
    return this;
  }

  /**
   * Remove a specific listener for an event
   * @param {string} event - Event name
   * @param {Function} listener - Callback to remove
   * @returns {EventEmitter} this (for chaining)
   */
  off(event, listener) {

    let listeners = this.events.get(event);

    if (!listeners || listeners.length === 0) return this;
    
    const indexToDel = listeners.findIndex((element) => 
      element === listener || (element._original && element._original === listener)
    );

    if (indexToDel!=-1){
      listeners.splice(indexToDel, 1);
    }

    if (listeners.length===0) this.events.delete(event);

    return this;
  }

  /**
   * Emit an event, calling all registered listeners
   * @param {string} event - Event name
   * @param {...*} args - Arguments to pass to listeners
   * @returns {boolean} true if event had listeners
   */
  emit(event, ...args) {

    const listeners = this.events.get(event);

    if (!listeners) return false;
    
    const copyListeners = [...listeners]

    copyListeners.forEach(listener => {
      listener.apply(this, args);
    });

    return true;
  }

  /**
   * Register a one-time listener
   * @param {string} event - Event name
   * @param {Function} listener - Callback function
   * @returns {EventEmitter} this (for chaining)
   */
  once(event, listener) {
    // TODO: Implement once

    const wrapper = (...args) => {
      this.off(event, wrapper);

      return listener.apply(this, args);
    }

    wrapper._original = listener;

    this.on(event, wrapper);

    return this; 
  }

  /**
   * Remove all listeners for an event (or all events)
   * @param {string} [event] - Event name (optional)
   * @returns {EventEmitter} this (for chaining)
   */
  removeAllListeners(event) {
    if (event){
      this.events.delete(event);
    }
    else this.events.clear();

    return this;
  }

  /**
   * Get array of listeners for an event
   * @param {string} event - Event name
   * @returns {Function[]} Array of listener functions
   */
  listeners(event) {
    const listeners = this.events.get(event) 
    return listeners ? [...listeners] : []; 
  }

  /**
   * Get number of listeners for an event
   * @param {string} event - Event name
   * @returns {number} Listener count
   */
  listenerCount(event) {
    const listeners = this.events.get(event); 
    return  listeners ? listeners.length : 0;
  }
}

module.exports = { EventEmitter };
