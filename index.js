import types from './types';
import { Type } from './type';

var toString = Object.prototype.toString;



/**
 * Function to store type checks
 * @private
 */
function TypeChecker() {
  this.checks = [];
}

TypeChecker.prototype = {
  add: function(func) {
    this.checks.push(func);
    return this;
  },

  addBeforeFirstMatch: function(obj, func) {
    var match = this.getFirstMatch(obj);
    if (match) {
      this.checks.splice(match.index, 0, func);
    } else {
      this.add(func);
    }
  },

  addTypeOf: function(type, res) {
    return this.add(function(obj, tpeOf) {
      if (tpeOf === type) {
        return new Type(res);
      }
    });
  },

  addClass: function(cls, res, sub) {
    return this.add(function(obj, tpeOf, objCls) {
      if (objCls === cls) {
        return new Type(types.OBJECT, res, sub);
      }
    });
  },

  getFirstMatch: function(obj) {
    var typeOf = typeof obj;
    var cls = toString.call(obj);

    for (var i = 0, l = this.checks.length; i < l; i++) {
      var res = this.checks[i].call(this, obj, typeOf, cls);
      if (typeof res !== 'undefined') {
        return { result: res, func: this.checks[i], index: i };
      }
    }
  },

  getType: function(obj) {
    var match = this.getFirstMatch(obj);
    return match && match.result;
  }
};

var main = new TypeChecker();

//TODO add iterators

main
  .addTypeOf(types.NUMBER, types.NUMBER)
  .addTypeOf(types.UNDEFINED, types.UNDEFINED)
  .addTypeOf(types.STRING, types.STRING)
  .addTypeOf(types.BOOLEAN, types.BOOLEAN)
  .addTypeOf(types.FUNCTION, types.FUNCTION)
  .addTypeOf(types.SYMBOL, types.SYMBOL)
  .add(function(obj) {
    if (obj === null) {
      return new Type(types.NULL);
    }
  })
  .addClass('[object String]', types.STRING)
  .addClass('[object Boolean]', types.BOOLEAN)
  .addClass('[object Number]', types.NUMBER)
  .addClass('[object Array]', types.ARRAY)
  .addClass('[object RegExp]', types.REGEXP)
  .addClass('[object Error]', types.ERROR)
  .addClass('[object Date]', types.DATE)
  .addClass('[object Arguments]', types.ARGUMENTS)

  .addClass('[object ArrayBuffer]', types.ARRAY_BUFFER)
  .addClass('[object Int8Array]', types.TYPED_ARRAY, 'int8')
  .addClass('[object Uint8Array]', types.TYPED_ARRAY, 'uint8')
  .addClass('[object Uint8ClampedArray]', types.TYPED_ARRAY, 'uint8clamped')
  .addClass('[object Int16Array]', types.TYPED_ARRAY, 'int16')
  .addClass('[object Uint16Array]', types.TYPED_ARRAY, 'uint16')
  .addClass('[object Int32Array]', types.TYPED_ARRAY, 'int32')
  .addClass('[object Uint32Array]', types.TYPED_ARRAY, 'uint32')
  .addClass('[object Float32Array]', types.TYPED_ARRAY, 'float32')
  .addClass('[object Float64Array]', types.TYPED_ARRAY, 'float64')

  .addClass('[object Bool16x8]', types.SIMD, 'bool16x8')
  .addClass('[object Bool32x4]', types.SIMD, 'bool32x4')
  .addClass('[object Bool8x16]', types.SIMD, 'bool8x16')
  .addClass('[object Float32x4]', types.SIMD, 'float32x4')
  .addClass('[object Int16x8]', types.SIMD, 'int16x8')
  .addClass('[object Int32x4]', types.SIMD, 'int32x4')
  .addClass('[object Int8x16]', types.SIMD, 'int8x16')
  .addClass('[object Uint16x8]', types.SIMD, 'uint16x8')
  .addClass('[object Uint32x4]', types.SIMD, 'uint32x4')
  .addClass('[object Uint8x16]', types.SIMD, 'uint8x16')

  .addClass('[object DataView]', types.DATA_VIEW)
  .addClass('[object Map]', types.MAP)
  .addClass('[object WeakMap]', types.WEAK_MAP)
  .addClass('[object Set]', types.SET)
  .addClass('[object WeakSet]', types.WEAK_SET)
  .addClass('[object Promise]', types.PROMISE)
  .addClass('[object Blob]', types.BLOB)
  .addClass('[object File]', types.FILE)
  .addClass('[object FileList]', types.FILE_LIST)
  .addClass('[object XMLHttpRequest]', types.XHR)
  .add(function(obj) {
    if ((typeof Promise === types.FUNCTION && obj instanceof Promise) ||
        (typeof obj.then === types.FUNCTION)) {
          return new Type(types.OBJECT, types.PROMISE);
        }
  })
  .add(function(obj) {
    if (typeof Buffer !== 'undefined' && obj instanceof Buffer) {// eslint-disable-line no-undef
      return new Type(types.OBJECT, types.BUFFER);
    }
  })
  .add(function(obj) {
    if (typeof Node !== 'undefined' && obj instanceof Node) {
      return new Type(types.OBJECT, types.HTML_ELEMENT, obj.nodeName);
    }
  })
  .add(function(obj) {
    // probably at the begginging should be enough these checks
    if (obj.Boolean === Boolean && obj.Number === Number && obj.String === String && obj.Date === Date) {
      return new Type(types.OBJECT, types.HOST);
    }
  })
  .add(function() {
    return new Type(types.OBJECT);
  });

/**
 * Get type information of anything
 *
 * @param  {any} obj Anything that could require type information
 * @return {Type}    type info
 * @private
 */
function getGlobalType(obj) {
  return main.getType(obj);
}

getGlobalType.checker = main;
getGlobalType.TypeChecker = TypeChecker;
getGlobalType.Type = Type;

Object.keys(types).forEach(function(typeName) {
  getGlobalType[typeName] = types[typeName];
});

export default getGlobalType;
