var toString = Object.prototype.toString;

var isPromiseExist = typeof Promise !== 'undefined';
var isBufferExist = typeof Buffer !== 'undefined';

var type = {
  NUMBER: 'number',
  UNDEFINED: 'undefined',
  STRING: 'string',
  BOOLEAN: 'boolean',
  OBJECT: 'object',
  FUNCTION: 'function',
  NULL: 'null',
  ARRAY: 'array',
  REGEXP: 'regexp',
  DATE: 'date',
  ERROR: 'error',
  ARGUMENTS: 'arguments',
  SYMBOL: 'symbol',
  ARRAY_BUFFER: 'array-buffer',
  TYPED_ARRAY: 'typed-array',
  DATA_VIEW: 'data-view',
  MAP: 'map',
  SET: 'set',
  WEAK_SET: 'weak-set',
  WEAK_MAP: 'weak-map',
  PROMISE: 'promise',

  WRAPPER_NUMBER: 'object-number',
  WRAPPER_BOOLEAN: 'object-boolean',
  WRAPPER_STRING: 'object-string',

// node buffer
  BUFFER: 'buffer',

// dom html element
  HTML_ELEMENT: 'html-element',
  HTML_ELEMENT_TEXT: 'html-element-text',
  DOCUMENT: 'document',
  WINDOW: 'window',
  FILE: 'file',
  FILE_LIST: 'file-list',
  BLOB: 'blob',

  XHR: 'xhr'
};

module.exports = function getType(instance) {
  var type = typeof instance;

  switch(type) {
    case type.NUMBER:
      return type.NUMBER;
    case type.UNDEFINED:
      return type.UNDEFINED;
    case type.STRING:
      return type.STRING;
    case type.BOOLEAN:
      return type.BOOLEAN;
    case type.FUNCTION:
      return type.FUNCTION;
    case type.SYMBOL:
      return type.SYMBOL;
    case type.OBJECT:
      if(instance === null) return type.NULL;

      var clazz = toString.call(instance);

      switch(clazz) {
        case '[object String]':
          return type.WRAPPER_STRING;
        case '[object Boolean]':
          return type.WRAPPER_BOOLEAN;
        case '[object Number]':
          return type.WRAPPER_NUMBER;
        case '[object Array]':
          return type.ARRAY;
        case '[object RegExp]':
          return type.REGEXP;
        case '[object Error]':
          return type.ERROR;
        case '[object Date]':
          return type.DATE;
        case '[object Arguments]':
          return type.ARGUMENTS;
        case '[object Math]':
          return type.OBJECT;
        case '[object JSON]':
          return type.OBJECT;
        case '[object ArrayBuffer]':
          return type.ARRAY_BUFFER;
        case '[object Int8Array]':
          return type.TYPED_ARRAY;
        case '[object Uint8Array]':
          return type.TYPED_ARRAY;
        case '[object Uint8ClampedArray]':
          return type.TYPED_ARRAY;
        case '[object Int16Array]':
          return type.TYPED_ARRAY;
        case '[object Uint16Array]':
          return type.TYPED_ARRAY;
        case '[object Int32Array]':
          return type.TYPED_ARRAY;
        case '[object Uint32Array]':
          return type.TYPED_ARRAY;
        case '[object Float32Array]':
          return type.TYPED_ARRAY;
        case '[object Float64Array]':
          return type.TYPED_ARRAY;
        case '[object DataView]':
          return type.DATA_VIEW;
        case '[object Map]':
          return type.MAP;
        case '[object WeakMap]':
          return type.WEAK_MAP;
        case '[object Set]':
          return type.SET;
        case '[object WeakSet]':
          return type.WEAK_SET;
        case '[object Promise]':
          return type.PROMISE;
        case '[object Window]':
          return type.WINDOW;
        case '[object HTMLDocument]':
          return type.DOCUMENT;
        case '[object Blob]':
          return type.BLOB;
        case '[object File]':
          return type.FILE;
        case '[object FileList]':
          return type.FILE_LIST;
        case '[object XMLHttpRequest]':
          return type.XHR;
        case '[object Text]':
          return type.HTML_ELEMENT_TEXT;
        default:
          if(isPromiseExist && instance instanceof Promise && getType(instance.then) === FUNCTION && instance.then.length >= 2) return type.PROMISE;

          if(isBufferExist && instance instanceof Buffer) return type.BUFFER;

          if(/^\[object HTML\w+Element\]$/.test(clazz)) return type.HTML_ELEMENT;

          if(clazz === '[object Object]') return type.OBJECT;
      }
  }
};

module.exports.type = type;
