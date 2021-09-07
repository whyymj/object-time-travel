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
      if(child===null){
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
  return typeof child === 'object'&&child ? false :true;
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

// function getCertainPathChild(tree, path) {
//   let child = tree;
//   for (let i = 0; i < path.length; i++) {
//     if (typeof child == 'object') {
//       child = child[path.get(i)];
//       continue;
//     } else {
//       child = undefined;
//       break;
//     }

//   }
//   return child
// }

// function traverseObj(tree, callback, path, targetPaths, ignorePaths) {
//   if (!path) {
//     path = snapShot.toImmutable([])
//   } else {
//     callback(path)
//   }
//   let curPath = null;
//   targetPaths = Immutable.fromJS(targetPaths);
//   ignorePaths = Immutable.fromJS(ignorePaths);
//   if (!Immutable.isList(ignorePaths)) {
//     ignorePaths = null;
//   }
//   if (!Immutable.isList(targetPaths)) {
//     targetPaths = null;
//   }
//   for (var key in tree) {
//     curPath = path.push(key)

//     if (typeof tree[key] == 'object' && !Array.isArray(tree[key])) {
//       if (!tree[key]) {
//         callback(curPath)
//         continue;
//       }
//       traverseObj(tree[key], callback, curPath, targetPaths, ignorePaths)
//     } else {
//       if (Array.isArray(tree[key])) {
//         tree[key].forEach(item => {
//           return callback(curPath.push(item))
//         })
//       } else {
//         callback(curPath.push(tree[key]))
//       }
//     }
//   }
// }