/**
 * Builder Pattern Implementation
 */

/**
 * Query Builder
 *
 * Builds SQL-like query strings.
 */
class QueryBuilder {
  constructor() {
    this.selectCols = [];
    this.fromTable = null;
    this.whereClauses = [];
    this.orderByClauses = [];
    this.limitCount = null;
  }

  /**
   * Select columns
   * @param {...string} columns - Column names
   * @returns {QueryBuilder} this
   */
  select(...columns) {
    this.selectCols = [...columns];
    return this;
  }

  /**
   * From table
   * @param {string} table - Table name
   * @returns {QueryBuilder} this
   */
  from(table) {
    this.fromTable = table;
    return this;
  }

  /**
   * Add where clause
   * @param {string} column - Column name
   * @param {string} operator - Comparison operator
   * @param {*} value - Value to compare
   * @returns {QueryBuilder} this
   */
  where(column, operator, value) {
    this.whereClauses.push({column, operator, value});
    return this;
  }

  /**
   * Add order by clause
   * @param {string} column - Column to order by
   * @param {string} [direction='ASC'] - ASC or DESC
   * @returns {QueryBuilder} this
   */
  orderBy(column, direction = "ASC") {
    this.orderByClauses.push({column, direction});
    return this;
  }

  /**
   * Set limit
   * @param {number} count - Maximum rows
   * @returns {QueryBuilder} this
   */
  limit(count) {
    this.limitCount = count;
    return this;
  }

  /**
   * Build the query string
   * @returns {string} SQL query string
   */
  build() {

    if (this.selectCols.length === 0){
      throw new Error('SELECT columns required');
    }
    if (!this.fromTable){
      throw new Error('FROM table required');
    }

    let query = `SELECT ${this.selectCols.join(', ')} FROM ${this.fromTable}`;

    if (this.whereClauses.length > 0){
      const whereStr = this.whereClauses
        .map(w => `${w.column} ${w.operator} ${JSON.stringify(w.value)}`)
        .join(' AND ');
      
      query += ` WHERE ${whereStr}`;

    }

    if (this.orderByClauses.length > 0){
      const orderStr = this.orderByClauses
        .map(o => `${o.column} ${o.direction}`)
        .join(', ');

      query += ` ORDER BY ${orderStr}`;
    }

    if (this.limitCount !== null){
      query += ` LIMIT ${this.limitCount}`;
    }


    return query;
  }

  /**
   * Reset builder state
   * @returns {QueryBuilder} this
   */
  reset() {
    this.selectCols = [];
    this.fromTable = null;
    this.whereClauses = [];
    this.orderByClauses = [];
    this.limitCount = null;

    return this;
  }
}

/**
 * HTML Builder
 *
 * Builds HTML element strings.
 */
class HTMLBuilder {
  constructor() {
    this.tagName = 'div';
    this.idAttr = null;
    this.classes = [];
    this.attributes = {};
    this.innerContent = '';
    this.children = [];
  }

  /**
   * Set tag name
   * @param {string} name - HTML tag name
   * @returns {HTMLBuilder} this
   */
  tag(name) {
    this.tagName = name;
    return this;
  }

  /**
   * Set id attribute
   * @param {string} id - Element ID
   * @returns {HTMLBuilder} this
   */
  id(id) {
    this.idAttr = id;
    return this;
  }

  /**
   * Add classes
   * @param {...string} classNames - Class names to add
   * @returns {HTMLBuilder} this
   */
  class(...classNames) {
    this.classes.push(...classNames);
    return this;
  }

  /**
   * Add attribute
   * @param {string} name - Attribute name
   * @param {string} value - Attribute value
   * @returns {HTMLBuilder} this
   */
  attr(name, value) {
    this.attributes[name] = value;
    return this;
  }

  /**
   * Set inner content
   * @param {string} content - Text content
   * @returns {HTMLBuilder} this
   */
  content(content) {
    this.innerContent = content;
    return this;
  }

  /**
   * Add child element
   * @param {string} childHtml - Child HTML string
   * @returns {HTMLBuilder} this
   */
  child(childHtml) {
    this.children.push(childHtml);
    return this;
  }

  /**
   * Build HTML string
   * @returns {string} HTML element string
   */
  build() {
    const attributes = [];

    if (this.idAttr){
      attributes.push(`id="${this.idAttr}"`);
    }
    if (this.classes.length>0){
      attributes.push(`class="${this.classes.join(' ')}"`);
    }
    
    for (const [name, value] of Object.entries(this.attributes)){
      attributes.push(`${name}="${value}"`);
    }

    const children = this.children.join('');

    const isVoidElement = ['img', 'br', 'hr', 'input', 'meta'].includes(this.tagName);

    if (isVoidElement) return `<${this.tagName}${attributes.length ? ' ' + attributes.join(' ') : ''}>`;

    const content = this.innerContent + children;

    return `<${this.tagName}${attributes.length ? ' ' + attributes.join(' ') : ''}>${content}</${this.tagName}>`;
  }

  /**
   * Reset builder state
   * @returns {HTMLBuilder} this
   */
  reset() {
    this.tagName = 'div';
    this.idAttr = null;
    this.classes = [];
    this.attributes = {};
    this.innerContent = '';
    this.children = [];

    return this;
  }
}

/**
 * Config Builder
 *
 * Builds configuration objects.
 */
class ConfigBuilder {
  constructor() {
    this.config = {
      environment: 'development',
      database: null,
      features: [],
      logLevel: 'info'
    };
  }

  /**
   * Set environment
   * @param {string} env - Environment name
   * @returns {ConfigBuilder} this
   */
  setEnvironment(env) {
    this.config.environment = env;
    return this;
  }

  /**
   * Set database configuration
   * @param {Object} dbConfig - Database config object
   * @returns {ConfigBuilder} this
   */
  setDatabase(dbConfig) {
    this.config.database = dbConfig;
    return this;
  }

  /**
   * Enable a feature
   * @param {string} feature - Feature name
   * @returns {ConfigBuilder} this
   */
  enableFeature(feature) {
    this.config.features.push(feature);
    return this;
  }

  /**
   * Disable a feature
   * @param {string} feature - Feature name
   * @returns {ConfigBuilder} this
   */
  disableFeature(feature) {
    const featureIndex = this.config.features.findIndex(f => f === feature);
    if (featureIndex!=-1){
      this.config.features.splice(featureIndex, 1);
    }
    return this;
  }

  /**
   * Set log level
   * @param {string} level - Log level
   * @returns {ConfigBuilder} this
   */
  setLogLevel(level) {
    this.config.logLevel = level;
    return this;
  }

  /**
   * Build configuration object
   * @returns {Object} Configuration object
   */
  build() {
    return structuredClone(this.config);
  }
}

/**
 * Request Builder
 *
 * Builds HTTP request configurations.
 */
class RequestBuilder {
  constructor(baseUrl = "") {
    this.baseUrl = baseUrl;
    this.config = {
      method: 'GET',
      path: '',
      query: {},
      headers: {},
      body: null
    }
  }

  /**
   * Set HTTP method
   * @param {string} method - GET, POST, PUT, DELETE, etc.
   * @returns {RequestBuilder} this
   */
  method(method) {
    this.config.method = method;
    return this;
  }

  /**
   * Set URL path
   * @param {string} path - URL path
   * @returns {RequestBuilder} this
   */
  path(path) {
    this.config.path = path;
    return this;
  }

  /**
   * Add query parameter
   * @param {string} key - Parameter name
   * @param {string} value - Parameter value
   * @returns {RequestBuilder} this
   */
  query(key, value) {
    this.config.query[key] = value;
    return this;
  }

  /**
   * Add header
   * @param {string} key - Header name
   * @param {string} value - Header value
   * @returns {RequestBuilder} this
   */
  header(key, value) {
    this.config.headers[key] = value;
    return this;
  }

  /**
   * Set request body
   * @param {*} body - Request body
   * @returns {RequestBuilder} this
   */
  body(body) {
    this.config.body = body;
    return this;
  }

  /**
   * Build request configuration
   * @returns {Object} Request config for fetch
   */
  build() {
    const url = new URL(this.config.path, this.baseUrl || 'http://localhost');

    Object.entries(this.config.query).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });

    return {
      url: url.toString(),
      method: this.config.method,
      headers: this.config.headers,
      body: this.config.body
    }
  }
}

module.exports = {
  QueryBuilder,
  HTMLBuilder,
  ConfigBuilder,
  RequestBuilder,
};
