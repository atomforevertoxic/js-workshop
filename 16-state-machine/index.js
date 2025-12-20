/**
 * State Machine Implementation
 */
class StateMachine {
  /**
   * Create a state machine
   * @param {Object} config - Machine configuration
   * @param {string} config.initial - Initial state
   * @param {Object} config.states - State definitions
   * @param {Object} [config.context] - Initial context data
   */
  constructor(config) {

    if (!config.initial) {
      throw new Error('Config must have initial state');
    }

    if (!config.states || typeof config.states !== 'object') {
      throw new Error('Config must have states object');
    }

    this.config = config;
    this.currentState = config.initial;
    this.context = config.context || {};

    if (!(this.currentState in config.states)){
      throw new Error('Initial state is not in states object!');
    }
  }

  /**
   * Get current state
   * @returns {string}
   */
  get state() {
    return this.currentState;
  }

  /**
   * Attempt a state transition
   * @param {string} event - Event name
   * @param {Object} [payload] - Optional data for the transition
   * @returns {boolean} Whether transition was successful
   */
  transition(event, payload) {

    const currentStateConfig = this.config.states[this.currentState];

    const trans = currentStateConfig?.on?.[event]; 
    if (!trans){
      return false;
    }

    let target, guard, action;

    if (typeof trans === 'string'){
      target = trans;
    }
    else if (typeof trans === 'object'){
      target = trans.target;
      guard = trans.guard;
      action = trans.action;
    }
    else return false;



    if (guard && !guard(this.context, payload)){
      return false;
    }

    const prevState = this.currentState;
    this.currentState = target;

    if (action) action(this.context, payload);

    return true;
  }

  /**
   * Check if a transition is possible
   * @param {string} event - Event name
   * @returns {boolean}
   */
  can(event) {
    const stateConfig = this.config.states[this.currentState];
    
    const transition = stateConfig?.on?.[event];

    if (!transition) return false;

    if (typeof transition === 'object' && transition.guard){
      return transition.guard(this.context);
    }

    return true;
  }

  /**
   * Get available transitions from current state
   * @returns {string[]} Array of event names
   */
  getAvailableTransitions() {
    const stateConfig  = this.config.states[this.currentState];

    if (!stateConfig?.on) return [];

    return Object.keys(stateConfig.on);

  }

  /**
   * Get the context data
   * @returns {Object}
   */
  getContext() {
    return this.context;
  }

  /**
   * Update context data
   * @param {Object|Function} updater - New context or updater function
   */
  updateContext(updater) {
    if (typeof updater === 'function'){
      this.context = updater(this.context);
    }
    else if (typeof updater === 'object' && updater !== null){
      this.context = { ...this.context, ...updater};
    }
    else{
      throw new Error('Invalid updater (must be function or object)');
    }
  }

  /**
   * Check if machine is in a final state (no transitions out)
   * @returns {boolean}
   */
  isFinal() {
    const stateConfig = this.config.states[this.currentState];
    if (!stateConfig) return false;

    const trans = stateConfig.on;

    return !trans || Object.keys(trans).length === 0;

  }

  /**
   * Reset machine to initial state
   * @param {Object} [newContext] - Optional new context
   */
  reset(newContext) {
    this.currentState = this.config.initial;

    if (newContext) this.context = newContext;
  }
}

/**
 * Create a state machine factory
 *
 * @param {Object} config - Machine configuration
 * @returns {Function} Factory function that creates machines
 */
function createMachine(config) {
  return () => new StateMachine(config);
}

module.exports = { StateMachine, createMachine };
