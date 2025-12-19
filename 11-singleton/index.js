/**
 * Singleton Pattern Implementation
 */

/**
 * Basic Singleton Class
 *
 * A class that only allows one instance to exist.
 */
class Singleton {
  
  static instance = null;

  constructor(){
    if (Singleton.instance){
      throw new Error('Use Singleton.getInstance()');
    }
  }

  static getInstance() {
    if (!this.instance){
      this.instance = new Singleton();
    }
    
    return this.instance;
  }


  // Step 4: Add a reset method for testing
  static resetInstance() {
    this.instance = null;
  }
}

/**
 * Singleton Factory
 *
 * Converts any class into a singleton.
 *
 * @param {Function} Class - The class to make singleton
 * @returns {Object} Object with getInstance method
 */
function createSingleton(Class) {
  
  let instance = null;


  // Step 2: Return an object with getInstance method
  // getInstance should:
  //   - Accept arguments to pass to constructor
  //   - Only create instance on first call
  //   - Return the same instance on subsequent calls

  // Step 3: Optionally add resetInstance method

  return {
    getInstance: (...args) => {
      if (!instance){
        instance = new Class(...args);
      }
      return instance;
    },
    resetInstance: () => {
      instance = null;
    },
  };
}

/**
 * Example: Database Connection Singleton
 *
 * A practical example of a singleton for database connections.
 */
class DatabaseConnection {
  constructor(connectionString) {
    this.connectionString = connectionString;
    this.connected = false;
  }

  connect() {
    if (!this.connected) {
      // Simulate connection
      this.connected = true;
      console.log(`Connected to ${this.connectionString}`);
    }
    return this;
  }

  query(sql) {
    if (!this.connected) {
      throw new Error("Not connected");
    }
    return `Executing: ${sql}`;
  }

  disconnect() {
    this.connected = false;
  }
}

/**
 * Example: Configuration Singleton
 *
 * A practical example of a singleton for app configuration.
 */
class AppConfig {
  constructor() {
    this.settings = {};
  }

  set(key, value) {
    this.settings[key] = value;
    return this;
  }

  get(key) {
    return this.settings[key];
  }

  getAll() {
    return { ...this.settings };
  }
}

module.exports = {
  Singleton,
  createSingleton,
  DatabaseConnection,
  AppConfig,
};
