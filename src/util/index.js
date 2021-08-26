/* @flow */

export * from './shared'
 
export { defineReactive } from '../observer/index'
/**
 * Define a property.
 */
 export function def (obj, key, val, enumerable) {
    Object.defineProperty(obj, key, {
      value: val,
      enumerable: !!enumerable,
      writable: true,
      configurable: true
    })
  }
  