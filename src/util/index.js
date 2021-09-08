/* @flow */
// import snapShot from 'tree-snap-shot'
import Immutable from 'immutable'
export * from './shared'

export {
  defineReactive
}
from '../observer/index'
/**
 * Define a property.
 */
export function def(obj, key, val, enumerable) {
  Object.defineProperty(obj, key, {
    value: val,
    enumerable: !!enumerable,
    writable: true,
    configurable: true
  })
}

function isTreeChildPath(path, tree) {

  let child = tree;
  for (let p of path) {
    if (typeof child === 'object') {
      if (child === null) {
        break;
      }
      child = child[p];
      if (child === undefined) {
        return false;
      }
      continue;
    } else {
      return false;
    }
  }
  return typeof child === 'object' && child ? false : true;
}

export function isParentPath(path, tree, callback) {
  if (Array.isArray(tree)) {
    return isChildPath(tree, path)
  }
  let child = tree
  for (let p of path) {
    if (typeof child === 'object') {
      child = child[p];
      continue;
    } else {
      return false;
    }
  }
  callback && callback(child);
  return child !== undefined
}
export function isChildPath(childPath, parentPath) {

  if (!Array.isArray(parentPath)) {
    return isTreeChildPath(childPath, parentPath)
  }
  childPath = Immutable.fromJS(childPath)
  parentPath = Immutable.fromJS(parentPath)

  if (childPath.size < parentPath.size) {
    return false
  }
  for (let i = parentPath.size - 1; i > 0; i--) {
    if (parentPath.get(i) != childPath.get(i)) {
      return false
    }
  }
  return true;
}

export function createTreeByPaths(paths, tree = {}) {

  paths.map((path) => {
    let child = tree;
    let p;
    for (let i = 0; i < path.length; i++) {
      p = path[i];
      if (child === null) {
        break;
      }
      if (child && i === path.length - 1) {
        child[p] = null
      } else if (child[p] === undefined) {
        child = child[p] = {}
      } else if (child && typeof child == 'object') {
        child = child[p]
      }
    }
  })

  return tree
}

export function getCertainPathChild(path, tree) {
  path = Immutable.fromJS(path)
  let child = tree;
  for (let i = 0; i < path.size; i++) {
    if (typeof child == 'object') {
      child = child[path.get(i)];
      continue;
    } else {
      child = undefined;
      break;
    }
  }
  return child
}
export function sliceChildTreePath(wholePath, parentPart) {
  if (wholePath.length < parentPart.length) {
    return
  }
  for (let i = 0; i < parentPart.length; i++) {
    if (wholePath[i] !== parentPart[i]) {
      return
    }
  }
  return wholePath.slice(parentPart.length)
}