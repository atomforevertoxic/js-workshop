/**
 * Strategy Pattern Implementation
 */

// ============================================
// SORTING STRATEGIES
// ============================================

/**
 * Sort Context
 *
 * Delegates sorting to a strategy.
 */
class SortContext {
  constructor(strategy) {
    this.strategy = strategy;
  }

  setStrategy(strategy) {
    this.strategy = strategy;
  }

  sort(array) {
    const copy = [...array];
    return this.strategy.sort(copy);
  }
}

/**
 * Bubble Sort Strategy
 */
class BubbleSort {
  sort(array) {
    for (let i = 0; i < array.length; i++){
      for (let j = 0; j < array.length-1; j++){
        if (array[j] > array[j+1]){
          [array[j], array[j+1]] = [array[j+1], array[j]];
        }
      }
    }

    return array;
  }
}

/**
 * Quick Sort Strategy
 */
class QuickSort {
  sort(array) {

    if (array.length <= 1) return array;

    const left = [];
    const right = [];
    const pivot = array[0];

    for (let i = 1; i < array.length; i++){
      if (array[i] < pivot){
        left.push(array[i]);
      }
      else{
        right.push(array[i]);
      }
    }

    return [...this.sort(left), pivot, ...this.sort(right)];
  }
}

/**
 * Merge Sort Strategy
 */
class MergeSort {
  sort(array) {
    if (array.length <= 1) return array;

    const midIndex = Math.floor(array.length / 2);

    const left = this.sort(array.slice(0, midIndex));
    const right = this.sort(array.slice(midIndex));

    return this.merge(left, right);
  }

  merge(left, right){
    const result = [];

    let i = 0, j = 0;

    while (i<left.length && j<right.length){
      if (left[i]<right[j]){
        result.push(left[i]);
        i++;
      }
      else{
        result.push(right[j]);
        j++;
      }
    }

    return [...result, ...left.slice(i), ...right.slice(j)];
  }
}

// ============================================
// PRICING STRATEGIES
// ============================================

/**
 * Pricing Context
 *
 * Calculates prices using a strategy.
 */
class PricingContext {
  constructor(strategy) {
    this.strategy = strategy;
  }

  setStrategy(strategy) {
    this.strategy = strategy;
  }

  calculateTotal(items) {
    return this.strategy.calculate(items);
  }
}

/**
 * Regular Pricing (no discount)
 */
class RegularPricing {
  calculate(items) {
    return items.reduce((sum, item) => {
      return sum += item.price;
    }, 0);
  }
}

/**
 * Percentage Discount
 */
class PercentageDiscount {
  constructor(percentage) {
    this.percentage = percentage;
  }

  calculate(items) {
    return items.reduce((sum, item) => {
      return sum += item.price * (1 - this.percentage/100);
    }, 0);
  }
}

/**
 * Fixed Discount
 */
class FixedDiscount {
  constructor(amount) {
    this.amount = amount;
  }

  calculate(items) {
    const subtotal = items.reduce((sum, item) => sum + item.price, 0);
    return Math.max(subtotal - this.amount, 0);
  }
}

/**
 * Buy One Get One Free
 */
class BuyOneGetOneFree {
  calculate(items) {
    const sorted = [...items].sort((a, b) => b.price - a.price);

    let result = 0;

    for (let i = 0; i < sorted.length; i++){
      if (i%2 === 0) result += sorted[i].price;
    }

    return result;
  }
}

/**
 * Tiered Discount
 *
 * Different discount based on total.
 */
class TieredDiscount {
  constructor(tiers) {
    this.tiers = [...tiers].sort((a, b) => a.threshold - b.threshold);
  }

  calculate(items) {

    const subtotal = items.reduce((sum, item) => {
      return sum += item.price;
    }, 0);

    let discount = 0;

    for (const tier of this.tiers){
      if (subtotal >= tier.threshold){
        discount = tier.discount;
      }
    }

    return subtotal * (1- discount/100);
  }
}

// ============================================
// VALIDATION STRATEGIES
// ============================================

/**
 * Validation Context
 */
class ValidationContext {
  constructor(strategy) {
    this.strategy = strategy;
  }

  setStrategy(strategy) {
    this.strategy = strategy;
  }

  validate(data) {
    return this.strategy.validate(data);
  }
}

/**
 * Strict Validation
 *
 * Requires all three fields to be present and valid:
 * - name: must be a non-empty string
 * - email: must be a non-empty string (no regex validation required)
 * - age: must be a number (any number is valid, no range check required)
 */
class StrictValidation {
  validate(data) {
    const name = data.name;
    const email = data.email;
    const age = data.age;

    const errors = [];

    let valid = true;

    if (!name){
      errors.push('Name is required');
      valid = false;
    }

    if (!email){
      errors.push('Email is required');
      valid = false;
    }

    if (!Number.isInteger(age)){
      errors.push('Age must be a number');
      valid = false;
    }

    return {valid, errors};
  }
}

/**
 * Lenient Validation
 *
 * Accepts any data, including empty objects.
 * No validation rules - always passes.
 */
class LenientValidation {
  validate(data) {
    return { valid: true, errors: [] }; 
  }
}

// ============================================
// STRATEGY REGISTRY
// ============================================

/**
 * Strategy Registry
 *
 * Register and retrieve strategies by name.
 */
class StrategyRegistry {
  constructor() {
    this.strategies = new Map();
  }

  register(name, strategy) {
    this.strategies.set(name, strategy);
  }

  get(name) {
    return this.strategies.get(name) || null;
  }

  has(name) {
    return this.strategies.has(name);
  }
}

module.exports = {
  // Sorting
  SortContext,
  BubbleSort,
  QuickSort,
  MergeSort,
  // Pricing
  PricingContext,
  RegularPricing,
  PercentageDiscount,
  FixedDiscount,
  BuyOneGetOneFree,
  TieredDiscount,
  // Validation
  ValidationContext,
  StrictValidation,
  LenientValidation,
  // Registry
  StrategyRegistry,
};
