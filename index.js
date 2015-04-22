var toString = Object.prototype.toString;

var types = require('./types');

function TypeChecker() {
  this.checks = [];
}

TypeChecker.prototype = {
  add: function(func) {
    this.checks.push(func);
    return this;
  },

  addTypeOf: function(type, res) {
    return this.add(function(obj, tpeOf) {
      if(tpeOf === type) {
        return res;
      }
    });
  },

  addClass: function(cls, res) {
    return this.add(function(obj, tpeOf, objCls) {
      if(objCls === cls) {
        return res;
      }
    });
  },

  getType: function(obj) {
    var typeOf = typeof obj;
    var cls = toString.call(obj);

    for(var i = 0, l = this.checks.length; i < l; i++) {
      var res = this.checks[i].call(this, obj, typeOf, cls);
      if(typeof res !== 'undefined') return res;
    }

  }
};

var global = new TypeChecker();

global
  .addTypeOf(types.NUMBER, types.NUMBER)
  .addTypeOf(types.UNDEFINED, types.UNDEFINED)
  .addTypeOf(types.STRING, types.STRING)
  .addTypeOf(types.BOOLEAN, types.BOOLEAN)
  .addTypeOf(types.FUNCTION, types.FUNCTION)
  .addTypeOf(types.SYMBOL, types.SYMBOL)
  .add(function(obj, tpeOf) {
    if(obj === null) return types.NULL;
  })
  .addClass('[object String]', types.WRAPPER_STRING)
  .addClass('[object Boolean]', types.WRAPPER_BOOLEAN)
  .addClass('[object Number]', types.WRAPPER_NUMBER)
  .addClass('[object Array]', types.ARRAY)
  .addClass('[object RegExp]', types.REGEXP)
  .addClass('[object Error]', types.ERROR)
  .addClass('[object Date]', types.DATE)
  .addClass('[object Arguments]', types.ARGUMENTS)
  .addClass('[object Math]', types.OBJECT)
  .addClass('[object JSON]', types.OBJECT)
  .addClass('[object ArrayBuffer]', types.ARRAY_BUFFER)
  .addClass('[object Int8Array]', types.TYPED_ARRAY)
  .addClass('[object Uint8Array]', types.TYPED_ARRAY)
  .addClass('[object Uint8ClampedArray]', types.TYPED_ARRAY)
  .addClass('[object Int16Array]', types.TYPED_ARRAY)
  .addClass('[object Uint16Array]', types.TYPED_ARRAY)
  .addClass('[object Int32Array]', types.TYPED_ARRAY)
  .addClass('[object Uint32Array]', types.TYPED_ARRAY)
  .addClass('[object Float32Array]', types.TYPED_ARRAY)
  .addClass('[object Float64Array]', types.TYPED_ARRAY)//XXX not sure
  .addClass('[object DataView]', types.DATA_VIEW)
  .addClass('[object Map]', types.MAP)
  .addClass('[object WeakMap]', types.WEAK_MAP)
  .addClass('[object Set]', types.SET)
  .addClass('[object WeakSet]', types.WEAK_SET)
  .addClass('[object Promise]', types.PROMISE)
  .addClass('[object Window]', types.WINDOW)
  .addClass('[object HTMLDocument]', types.DOCUMENT)
  .addClass('[object Blob]', types.BLOB)
  .addClass('[object File]', types.FILE)
  .addClass('[object FileList]', types.FILE_LIST)
  .addClass('[object XMLHttpRequest]', types.XHR)
  .addClass('[object Text]', types.HTML_ELEMENT_TEXT)
  .add(function(obj) {
    if((typeof Promise === types.FUNCTION && obj instanceof Promise) ||
        (this.getType(obj.then) === types.FUNCTION)) {
          return types.PROMISE;
        }
  })
  .add(function(obj) {
    if(typeof Buffer !== 'undefined' && obj instanceof Buffer) {
      return types.BUFFER;
    }
  })
  .add(function(obj, _, cls) {
    if(/^\[object HTML\w+Element\]$/.test(cls)) {
      return types.HTML_ELEMENT;
    }
  })
  .add(function() {
    return types.OBJECT;
  });

function getGlobalType(obj) {
  return global.getType(obj);
}

getGlobalType.checker = global;
getGlobalType.TypeChecker = TypeChecker;

Object.keys(types).forEach(function(typeName) {
  getGlobalType[typeName] = types[typeName];
});

module.exports = getGlobalType;
