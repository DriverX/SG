(function( window, undefined ) {
  
var 
  document = window.document,
  // deprecated isOpera = /opera/i.test( window.navigator.userAgent ) && !!window.opera,
  
  // Props name
  str__proto = "prototype",
  str__constructor = "constructor",
  str__setTimeout = 'setTimeout',
  str__setInterval = 'setInterval',
  str__clearTimeout = 'clearTimeout',
  str__clearInterval = 'clearInterval',
  
  // Methods shortcuts
  Object__proto__ = Object[ str__proto ],
  hasOwnProperty = Object__proto__.hasOwnProperty,
  toString = Object__proto__.toString,
  Array__slice = Array[ str__proto ].slice,
  Array__forEach = Array[ str__proto ].forEach,
  Array__indexOf = Array[ str__proto ].indexOf,
  Array__map = Array[ str__proto ].map,
  String__trim = String[ str__proto ].trim,
  Function__bind = Function[ str__proto ].bind,
  urlEncode = encodeURIComponent,
  urlDecode = decodeURIComponent,
  setTimeout = window[ str__setTimeout ],
  setInterval = window[ str__setInterval ],
  clearTimeout = window[ str__clearTimeout ],
  clearInterval = window[ str__clearInterval ],
  now = Date.now || function() {
    return +new Date();
  },
  rWhiteSpaces = /\s+/,
  rFormatReplace = /\{(\w*)\}/mg,
  rRESpecSymb = /([-\\()^$.?+*\[\]\{\}])/g,
  
  EXPANDO = "SG" + now(),
  GUID = 1,
  getGUID = function() {
    return GUID++;
  },
  fnFALSE = function() {
    return false;
  },
  fnTRUE = function() {
    return true;
  },
  emptyFn = function() {};


// from jQuery
var curCSS;
if ( window.getComputedStyle ) {
  curCSS = function( elem, name ) {
    var ret, width, minWidth, maxWidth,
      computed = window.getComputedStyle( elem, null );
    if( computed ) {
      ret = computed.getPropertyValue( name ) || computed[ name ];
    }
    return ret;
  };
} else if ( document.documentElement.currentStyle ) {
  curCSS = function( elem, name ) {
    var left, rsLeft,
      ret = elem.currentStyle && elem.currentStyle[ name ],
      style = elem.style;
    if ( ret == null && style && style[ name ] ) {
      ret = style[ name ];
    }
    return ret === "" ? "auto" : ret;
  };
}


// Utils
var SGUtils = {
  
  hasOwn: function( obj, prop ) {
    return hasOwnProperty.call( obj, prop );
  },
  
  type: function( mixed ) {
    return
  },

  isArr: Array.isArray || function( obj ) {
    return toString.call( obj ) === "[object Array]";
  },
  
  isFn: function( obj ) {
    return toString.call( obj ) === "[object Function]";
  },
  
  
  /**
   * Проверяет, является ли переданный парамтром объектом window
   * @param {Mixed} obj
   * @return {Boolean}
   */
  isWin: function( obj ) {
    return !!obj && obj == obj.window;
  },
  
  
  /**
   * Проверяет, является ли переданный аргумент простым объектом. Возвращает true, если является, иначе false
   * @param {Mixed} obj
   * @return {Boolean}
   */
  isObj: function ( obj ) {
    // Must be an Object.
    // Because of IE, we also have to check the presence of the constructor property.
    // Make sure that DOM nodes and window objects don't pass through, as well
    if( !obj ||
      toString.call(obj) !== "[object Object]" || 
      SGUtils.isArr( obj ) || 
      SGUtils.isFn( obj ) ||
      obj.nodeType ||
      SGUtils.isWin( obj ) )
    {
      return false;
    }
  
    // Not own constructor property must be Object
    if( obj[ str__constructor ] &&
      !SGUtils.hasOwn( obj, str__constructor ) &&
      !SGUtils.hasOwn( obj[ str__constructor ][ str__proto ], "isPrototypeOf" ) )
    {
      return false;
    }
  
    // Own properties are enumerated firstly, so to speed up,
    // if last one is own, then all properties are own.
  
    var key;
    for( key in obj ) {}
  
    return key === undefined || SGUtils.hasOwn( obj, key );
  },
  

  bind: function( fn, obj ) {
    if( Function__bind ) {
      return Function__bind.apply( fn, Array__slice.call( arguments, 1 ) );
    }

    var args = Array__slice.call( arguments, 2 ),
      bound = function() {
        return fn.apply(this instanceof emptyFn ? this : (obj || {}), args.concat(Array__slice.call(arguments)));
      };
    emptyFn.prototype = fn.prototype;
    bound.prototype = new emptyFn();
    return bound;
  },
  

  /**
   * Расширяет объект переданный первым аргументом, полями объектов, переданными последующими аргументами
   * @param {Object|Boolean} Если true, то исходный объект будет расширен дальше первого уровня,
   *  причем исходный объект следует передавать вторым агрументом, а его расширящие последующими
   * @param {Object}
   * @return {Object}
   */
  ext: function() {
    var options, name, src, copy, copyIsArray, clone,
      args = arguments,
      target = args[0] || {},
      i = 1,
      length = args.length,
      deep = false;
  
    // Handle a deep copy situation
    if( typeof target === "boolean" ) {
      deep = target;
      target = args[1] || {};
      // skip the boolean and the target
      i = 2;
    }
  
    // Handle case when target is a string or something (possible in deep copy)
    if( typeof target !== "object" && !SGUtils.isFn( target ) ) {
      target = {};
    }
  
    for( ; i < length; i++ ) {
      // Only deal with non-null/undefined values
      if( ( options = args[ i ] ) != null ) {
        // Extend the base object
        for( name in options ) {
          src = target[ name ];
          copy = options[ name ];
  
          // Prevent never-ending loop
          if( target === copy ) {
            continue;
          }
  
          // Recurse if we're merging plain objects or arrays
          if( deep && copy && ( SGUtils.isObj( copy ) || ( copyIsArray = SGUtils.isArr( copy ) ) ) ) {
            if( copyIsArray ) {
              copyIsArray = false;
              clone = src && SGUtils.isArr( src ) ? src : [];
            } else {
              clone = src && SGUtils.isObj( src ) ? src : {};
            }
  
            // Never move original objects, clone them
            target[ name ] = extend( deep, clone, copy );
  
          // Don't bring in undefined values
          } else if( copy !== undefined ) {
            target[ name ] = copy;
          }
        }
      }
    }
  
    // Return the modified object
    return target;
  },
  
  
  /**
   * Копирует объект или массив
   * @param {Object|Array} obj
   * @param {Boolean} deep Copy all included items
   * @return {Object|Array}
   */
  copy: function( obj ) {
    return SGUtils.ext( true, SGUtils.isArr( obj ) ? [] : {}, obj );
  },
  
  
  /**
   * Отрезает пробельные символы слева и справа и возвращает форматированную строку
   * @param {String} str
   * @return {String}
   */
  trim: function( str ) {
    var ret;
    str = String( str );
    if( String__trim ) {
      ret = String__trim.call( str );
    } else {
      ret = str.replace(/^\s+|\s+$/, "");
    }
    return ret;
  },
  
  
  /**
   * Обходит массив по ключам
   * @param {Array} arr
   * @param {Function} fn
   * @param {Object|Null} context [optional]
   * @return void
   */
  arrEach: function( arr, fn, context ) {
    if( Array__forEach ) {
      Array__forEach.call( arr, fn, context );
    } else {
      for( var i = 0, l = arr.length, v; i < l; i++ ) {
        if( i in arr ) {
          fn.call( context, arr[ i ], i );
        }
      }
    }
  },
  
  
  /**
   * Обходит объект по ключам
   * @param {Object} obj
   * @param {Function} fn
   * @param {Object|Null} context [optional]
   * @return void
   */
  objEach: function( obj, fn, context ) {
    for( var prop in obj ) {
      if( SGUtils.hasOwn( obj, prop ) ) {
        fn.call( context, obj[ prop ], prop );
      }
    }
  },
  
  
  /**
   * Обходит объект по ключам
   * @param {Object|Array} obj
   * @param {Function} fn
   * @param {Object|Null} context [optional]
   * @return void
   */
  each: function( obj, fn, context ) {
    SGUtils[ typeof obj.length === "number" ? "arrEach" : "objEach" ]( obj, fn, context );
  },
  
  
  /**
   * Обходит каждый элемент массива и создает
   */
  map: function( arr, fn, context ) {
    if( Array__map ) {
      return Array__map.call( arr, fn, context );
    }
    
    var i = 0,
      l = arr.length,
      newArr = new Array( l );
    for( ; i < l; i++ ) {
      if( i in arr ) {
        newArr[ i ] = fn.call( context, arr[ i ], i );
      }
    }
    return newArr;
  },
  
  
  /**
   * Ищет элемент в массиве. Возвратит позицию жлемента в массиве, если он был найден, иначе -1
   * @param {Array} arr
   * @param {Mixed} find
   * @param {Number} from [optional]
   * @return {Number}
   */
  indexOf: function( arr, find, from ) {
    if( Array__indexOf ) {
      return Array__indexOf.call( arr, find, from );
    }
    
    from = from || 0;
    var ret = -1,
      i = 0,
      l = arr.length;
    
    if( from < l ) {
      if( from < 0 ) {
        i = Math.max( l - Math.abs( from ), 0 );
      }
      for( ; i < l; i++ ) {
        if( arr[ i ] === find ) {
          ret = i;
          break;
        }
      }
    }
    
    return ret;
  },
  
  
  /**
   * Функция поиска и замены вхождений в строке {some}
   * на значение свойства в объекта, переданного вторым аргументом.
   * @param {String} str Строка для замены
   * @param {Object} replaceObj Заменяеющие значения
   * @return {String}
   */
  format: function( str, replaceObj ) {
    var ret = str;
    if( str && replaceObj ) {
      ret = String( str ).replace( rFormatReplace, function( fullExpr, expr ) {
        return SGUtils.hasOwn( replaceObj, expr ) ? replaceObj[ expr ] : "";
      });
    } else if( str == null ) {
      ret = null;
    }

    return ret;
  },
  
  
  /**
   * Аналог функции .format() за исключением того,
   * что принимает первым параметром объект и замена происходит во всех свойствах объекта
   * @param {Object} obj
   * @param {Object} replaceObj
   * @return {Object}
   */
  objFormat: function( obj, replaceObj ) {
    var ret = {};
    SGUtils.objEach( obj, function( value, prop ) {
      ret[ prop ] = typeof value === "string"
        ? SGUtils.format( value, replaceObj )
        : SGUtils.isObj( value )
          ? SGUtils.objFormat( value, replaceObj )
          : value;
    });
    return ret;
  },
  
  
  /**
   * 
   */
  walker: function( obj, route, value ) {
    var needSet = arguments.length > 2,
      routeParts = route.split( "." ),
      i = 0,
      l = routeParts.length,
      root = obj,
      nextPath,
      path = null,
      prevValue,
      isLast;
    
    for( ; i < l; i++ ) {
      nextPath = routeParts[ i ];
      path = ( root = path || root )[ nextPath ];
      isLast = i == l - 1;
      if( path == null || !isLast && !SGUtils.isObj( path ) ) {
        if( !needSet ) {
          path = null;
          break;
        } else if( !isLast ) {
          path = root[ nextPath ] = {};
        }
      }
    }
    
    if( i == l && needSet ) {
      prevValue = root[ nextPath ];
      root[ nextPath ] = value;
    } else {
      value = path;
    }
    
    return needSet ? prevValue : value;
  },
  
  
  /**
   * Escape string for RegExp param
   * @param {String} str
   * @return {String}
   */
  resc: function( str ) {
    return String( str ).replace( rRESpecSymb, "\\$1" );
  },
  
  
  /**
   * Оборачивает переданный параметр в массив, если он им не является
   * @param {Mixed} obj
   * @return {Array}
   */
  from: function( obj ) {
    return obj == null
      ? []
      : SGUtils.isArr( obj )
        ? obj
        : [ obj ];
  },
  
  
  /**
   * Приводит like-array объект к Array типу
   * @param {Array-like object} arrayLike
   * @return {Array}
   */
  mkarr: function( arrayLike ) {
    var arr,
      l;
    if( arrayLike && ( l = arrayLike.length ) !== undefined ) {
      try {
        arr = Array__slice.call( arrayLike );
      } catch(e) {
        arr = new Array( l );
        while( l-- ) {
          if( l in arrayLike ) {
            arr[ l ] = arrayLike[ l ];
          }
        }
      }
    }
    return arr || [];
  },
  
  
  /**
   * Сериализует объект в querystring представление
   * @param {Object} obj
   * @return {String} Querystring
   */
  prm: function( obj ) {
    var key,
      value,
      ret = [];

    if( !obj ) {
      return "";
    }

    for( key in obj ) {
      if( SGUtils.hasOwn( obj, key ) ) {
        ret.push(
          SGUtils.map(
            [ key, SGUtils.isFn( value = obj[ key ] ) ? value() : value ],
            urlEncode
          ).join( "=" )
        );
      }
    }
    return ret.join( "&" );
  },


  /**
   * Добавляет к url-строке querystring параметры
   * @param {String} url
   * @param {Object|String} params
   * @return {String}
   */
  aprm: function( url, params ) {
    if( !params ) {
      return url;
    }
    url = String( url );
    var parts = [ url ],
      lastChar = url.charAt( url.length - 1 );
    parts.push(
      !~url.indexOf( "?" )
        ? "?"
        : lastChar !== "?" && lastChar !== "&"
          ? "&"
          : ""
    );
    parts.push( typeof params === "object" ? SGUtils.prm( params ) : params );
    return parts.join("");
  },
  
  
  /**
   * Сериализует специфичный объект в url-строку
   * @param {Object} obj
   * @return {String}
   */
  url: function( obj ) {
    var ret = [];
    
    if( obj.scheme && obj.authority ) {
      ret.push( obj.scheme, ":" );
    }
    
    if( obj.authority ) {
      ret.push( "//", obj.authority );
    }
    
    if( obj.path ) {
      ret.push( "/", !obj.path.indexOf( "/" ) ? obj.path.slice( 1 ) : obj.path );
    }
    
    if( obj.query ) {
      if( !obj.path && obj.authority ) {
        ret.push("/");
      }
      ret.push( SGUtils.aprm( "?", obj.query ) );
    }
    
    if( obj.fragment ) {
      if( !obj.path && obj.authority && !obj.query ) {
        ret.push("/");
      }
      var fragment = obj.fragment;
      ret.push( "#", typeof fragment === "object" ? SGUtils.prm( fragment ) : fragment );
    }
    
    return ret.join( "" );
  },
  

  /**
   * Устанавливает/Получает css-свойство элемента.
   *  Если 2-й агрумент не указан, то будет возвращены все css-свойства элемента
   *  Если 3-й агрумент не указан, то будет возвращено текущее значение.
   * @param {DOMNode} elem
   * @param {String} cssProp [optional]
   * @param {String} value [optional]
   * @return {String|Null}
   */
  css: function ( elem, cssProp, value ) {
    if( !elem ) {
      return null;
    }
    var ret = null;
    if( arguments.length > 2 && cssProp ) {
      elem.style[ cssProp ] = value;
    } else if( cssProp ) {
      ret = curCSS( elem, cssProp );
    }
    return ret;
  },
  
  
  /**
   * Добавляем один или несколько, переданных через пробел, классов к элементу
   * @param {DOMNode} elem
   * @param {String} klass
   * @return {Void}
   */
  addCls: function( elem, klass ) {
    var klasses = SGUtils.trim( klass ).split( rWhiteSpaces ),
      l = klasses.length,
      className = elem.className;
    while( l-- ) {
      klass = klasses[ l ];
      if( !SGUtils.hasCls( elem, klass ) ) {
        className += ' ' + klass;
      }
    }
    elem.className = SGUtils.trim( className );
  },
  
  
  /**
   * Удаляет один или несколько, переданных через пробел, классов у элемента
   * @param {DOMNode} elem
   * @param {String} klass
   * @return {Void}
   */
  rmCls: function( elem, klass ) {
    if( arguments.length > 1 ) {
      var klasses = SGUtils.trim( klass ).split( rWhiteSpaces ),
        l = klasses.length,
        className = elem.className,
        found,
        len,
        endFound;
      
      while( l-- ) {
        klass = klasses[ l ];
        className = className.replace(
          new RegExp( '(?:^|\\s+)' + SGUtils.resc( klass ) + '(?:\\s+|$)', 'g' ),
          ' '
        );
      }
      elem.className = SGUtils.trim( className );
    } else {
      elem.className = '';
    }
  },
  
  
  /**
   * Проверяет есть ли, переданный вторым аргументом, класс у элемента. Если есть возвращает true, иначе false.
   * @param {DOMNode} elem
   * @param {String} klass
   * @return {Boolean}
   */
  hasCls: function( elem, klass ) {
    klass = SGUtils.trim( klass );
    return !!( elem && elem.nodeType && klass && ~( ' ' + elem.className + ' ' ).indexOf( ' ' + klass + ' ' ) );
  },
  
  
  /**
   * Создает DOM-структуру по переданному html коду и возвращает созданные элементы в массиве.
   * @param {String} html
   * @return {Array}
   */
  cres: function( html ) {
    html = SGUtils.trim( html );
    var doc = document.createDocumentFragment(),
      helpDiv = doc.appendChild( document.createElement( "div" ) );
    helpDiv.innerHTML = html;
    return SGUtils.mkarr( helpDiv.childNodes );
  },
  
  
  /**
   * Создает DOM-дерево по переданному html-коду
   * @param {String} html
   * @return {DOMNode}
   */
  cre: function ( html ) {
    html = SGUtils.trim( html );
    var node;
    if( html.charAt( 0 ) === "<" && html.charAt( html.length - 1 ) === ">" ) {
      node = SGUtils.cres( html )[ 0 ];
    } else {
      node = document.createElement( html );
    }
    return node;
  },
  
  
  /**
   * Удаляет элемент из DOM-дерева
   * @param {DOMNode} elem
   * @return {Void}
   */
  rme: function( elem ) {
    if( elem && elem.parentNode ) {
      Suggest.Event.rm( elem );
      elem.parentNode.removeChild( elem );
    }
  },
  
  
  /**
   * Очищает элемент от детей
   * @param {DOMNode} elem
   * @return void
   */
  empty: function( elem ) {
    var child;
    while( elem && ( child = elem.firstChild ) ) {
      SGUtils.rme( child );
    }
  },
  
  
  /**
   * Устанавливает или получает аттрибут у элемента
   * @param {DOMNode} elem
   * @param {String} attr
   * @param {Strimg} value [optional]
   * @return {String|Void}
   */
  attr: function( elem, attr, value ) {
    if( arguments.length > 2 ) {
      elem.setAttribute( attr, value );
    }
    return elem.getAttribute( attr );
  },
  
  
  /**
   * Установлен ли на элементе фокус. Возвращает true, если установлен, иначе false.
   * @param {DOMNode} elem
   * @return {Boolean}
   */
  hasFocus: function ( elem ) {
    return !!elem && elem.ownerDocument.activeElement === elem;
  },
  
  
  /**
   * 
   */
  contains: document.documentElement.contains ? function( a, b ) {
    return a !== b && ( a.contains ? a.contains( b ) : true );
  } : document.documentElement.compareDocumentPosition ? function( a, b ) {
    return !!( a.compareDocumentPosition(b) & 16 );
  } : fnFALSE,
  
  // from jQuery
  // Cross-browser xml parsing
  parseXML: function( data ) {
    if ( typeof data !== "string" || !data ) {
      return null;
    }
    var xml, tmp;
    try {
      if ( window.DOMParser ) { // Standard
        tmp = new DOMParser();
        xml = tmp.parseFromString( data , "text/xml" );
      } else { // IE
        xml = new ActiveXObject( "Microsoft.XMLDOM" );
        xml.async = "false";
        xml.loadXML( data );
      }
    } catch( e ) {
      xml = undefined;
    }
    if ( !xml || !xml.documentElement || xml.getElementsByTagName( "parsererror" ).length ) {
      throw ("Invalid XML: " + data);
    }
    return xml;
  }
};

// from jQuery
// JSON RegExp
var rvalidchars = /^[\],:{}\s]*$/,
  rvalidescape = /\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,
  rvalidtokens = /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,
  rvalidbraces = /(?:^|:|,)(?:\s*\[)+/g;
SGUtils.parseJSON = function( data ) {
  if( typeof data !== "string" || !data ) {
    return null;
  }

  data = SGUtils.trim( data );

  if( window.JSON && window.JSON.parse ) {
    return window.JSON.parse( data );
  }

  // Make sure the incoming data is actual JSON
  // Logic borrowed from http://json.org/json2.js
  if( rvalidchars.test( data.replace( rvalidescape, "@" )
    .replace( rvalidtokens, "]" )
    .replace( rvalidbraces, "")) ) {
    return ( new Function( "return " + data ) )();
  }
  throw ( "Invalid JSON: " + data );
};

  
/**
 * Template Engine
 * based on Simple JavaScript Templating via John Resig - http://ejohn.org/
 */
SGUtils.tmpl = (function(){
  var start = "<%",
    end = "%>",
    reCarretSpaces = /[\r\t\n]/g,
    reEnding = RegExp( "((^|" + SGUtils.resc( end ) + ")[^\\t]*)'", "g" ),
    reVar = RegExp( "\\t=(.*?)" + SGUtils.resc( end ), "g" ), // new RegExp( "\\t=(.*?)" + SGUtils.resc( end ), "g" ),
    errors = [],
    cache = {};
  
  function tmpl( selector, data ) {
    var res,
      isString = typeof selector === "string",
      isSelector = false,
      isNode;
    
    if( isString ) {
      selector = SGUtils.trim( selector );
      isSelector = ( !selector.indexOf( "#" ) || !selector.indexOf( "." ) ) && selector.indexOf( start ) + selector.indexOf( end ) < 0;
    } else if( selector ) {
      isNode = !!selector.nodeType;
    }
    
    if( isSelector || isNode ) {
      if( isNode && selector[ EXPANDO ] ) {
        res = cache[ selector[ EXPANDO ] ];
      } else if( !isNode ) {
        res = cache[ selector ];
      }
      if( !res ) {
        var elem = SGUtils.$( selector );
        if( elem ) {
          res = cache[ ( elem[ EXPANDO ] || ( elem[ EXPANDO ] = getGUID() ) ) ] = tmpl( elem.innerHTML || "" );
          if( isString ) {
            cache[ selector ] = res;
          }
        }
      }
    } else {
      var tmplStr = selector;
      res = cache[ tmplStr ] ||
        (
          cache[ tmplStr ] = Function(
            "_o", "_e",
            "var _=[],print=function(){_.push.apply(p,arguments)};" +
                "with(_o||{}){_.push('" +
              tmplStr
                .replace( reCarretSpaces, " " )
                .split( start ).join( "\t" )
                .replace( reEnding, "$1\r" )
                .replace( reVar, function( $0, $1 ) {
                  $1 = SGUtils.trim( $1 );
                  return !$1 ? "" : [ "');", "try{_.push(" + $1 + ")}catch(e){_e.push(e)}", "_.push('" ].join( "" );
                })
                .split( "\t" ).join( "');" )
                .split( end ).join( "_.push('" )
                .split( "\r" ).join( "\\'" ) +
              "')}return _.join('')"
          )
        );
    }
    if( !res ) {
      res = data ? function() { return ""; } : "";
    }
    return data ? res( data, errors ) : res; 
  }
  
  tmpl.errs = errors;
  tmpl.cch = cache;
  return tmpl;
})();


// Shorthands
var extend = SGUtils.ext,
  isFunction = SGUtils.isFn;

  
function Suggest( inputOptions ) {
  var self = this;
  
  if (!(self instanceof Suggest)) {
    return new Suggest(inputOptions); 
  }
  
  var Evt = Suggest.Event;
  
  
  /**
   * Добавляет обработчик события на экзмпляр
   */
  function addEvent( eventType, handler ) {
    return Evt.add( self, eventType, handler );
  }
  
  
  /**
   * Удаляет обработчик события с экземпляра
   */
  function removeEvent( eventType, handler ) {
    eventType && Evt.rm( self, eventType, handler );
  }
  
  
  /**
   * Вызвать событие
   */
  function fireEvent( eventType, data ) {
    eventType && Evt.fire( self, eventType, data );
  }
  
  
  
  function getState() {
    return {
      current: checker.curr,
      recent: checker.rcnt,
      previous: checker.prev,
      value: viewValue,
      data: viewItemsData,
      fullData: viewData,
      focused: getIndex( $focused ),
      method: selectMethod,
      selected: getIndex( $selected ),
      result: getResult( $selected ),
      itemData: getItemData( $selected ),
      hovered: getIndex( $hovered ),
      items: SGUtils.mkarr( $items )
    };  
  }
  
  
  function getVal() {
    return $field.value;
  }
  function setVal( value ) {
    $field.value = value;
  }
  
  
  var checker = {
      run: false,
      did: null,
      prev: null,
      rcnt: null,
      curr: null,
      ignr: null,
      init: function() {
        if( !this.run ) {
          this.curr = this.prev = getVal();
          this.on();
        }
      },
      handler: function( noCheck ) {
        // Получаем текущее значение в поле
        var current = this.curr = getVal(),
          previous = this.prev;
        
        // Проверяем изменилось ли оно с последнего раза
        if( noCheck || current !== previous ) {
          if( !noCheck && this.ignr == null ) {
            this.rcnt = previous;
          }
          this.prev = current;
          
          if( noCheck || this.ignr == null || this.ignr !== current ) {
            fireEvent( SuggestEvents.valueChange, [ current, previous, this.rcnt ] );
            
            // Обрабатываем запрос
            handleValue( current );
          }
          this.ignr = null;
        }
      },
      
      /**
       * Принудительно проверяет текстовое поле.
       * @param {Boolean} noCheck [optional] Игнорирует проверку
       * @return void
       */
      fire: function( noCheck ) {
        this.off();
        this.handler( noCheck );
        this.on();
      },
      
      /**
       * Принудительно проверяет текстовое со вставкой запроса
       * @param {String} value
       * @param {Boolean} noCheck [optional] Игнорирует проверку
       * @return void 
       */
      fireVal: function( value, noCheck ) {
        this.off();
        setVal( value );
        this.handler( noCheck );
        this.on();
      },
      on: function() {
        if( !this.run ) {
          var self = this;
          this.run = true;
          this.did = setInterval(function() {
            self.handler();
          }, options.delay );
        } 
      },
      off: function() {
        if( this.run ) {
          this.run = false;
          clearInterval( this.did );
          this.did = null;
        }
      },
      setIgnore: function( value ) {
        if( getVal() !== value ) {
          setVal( value );
          this.ignr = value;
        }
      }
    };
  
  
  
  /**
   * Cache interface object
   */
  var cache = {
    
      // Собственно сам кэш
      c: {},
      i: 0,
      
      
      /**
       * Функция записи в кэш
       * @param {String} key Ключ, на которых записываем данные
       * @param {String|Number|Object|Array|Function|Boolean} data Данные, которые будут записаны
       * @return void
       */
      set: function( key, data ) {
        fireEvent( SuggestEvents.setCache, [ key, data ] );
        
        // Очищаем кэш, если есть настройка лимита и хранилище достигло предела
        if( options.cchLimit && this.i + 1 >= options.cchLimit ) {
          this.flush();
        }
        
        this.c[ key ] = data;
        this.i++;
        
        fireEvent( SuggestEvents.setCacheEnd, [ key, data, this.i ] );
      },
      
      
      /**
       * Функция получения данных из кэша по ключу
       * @param {String} key
       * @return {String|Number|Object|Array|Function|Boolean} Возвращает данные по ключу, иначе null
       */
      get: function( key ) {
        fireEvent( SuggestEvents.getCache, [ key ] );
        
        var data = this.has( key ) ? this.c[ key ] : null;
        
        fireEvent( SuggestEvents.getCacheEnd, [ key, data ] );
        
        return data;
      },
      
      
      /**
       * Проверяет есть ли запись по данному ключу
       * @param {String} key
       * @return {Boolean} Если запись есть возвращает true, иначе false 
       */
      has: function( key ) {
        return this.c[ key ] != null && SGUtils.hasOwn( this.c, key );
      },
      
      
      /**
       * Очищает все хранилище
       * @return void
       */
      flush: function() {
        fireEvent( SuggestEvents.flushCache );
        
        var c = this.c,
          prop;
        for( prop in c ) {
          if( SGUtils.hasOwn( c, prop ) ) {
            delete c[ prop ];
          }
        }
        this.i = 0;
        
        fireEvent( SuggestEvents.flushCacheEnd );
      }
    };
  
  
  var request = {
      // Активные запросы
      act: [],
      
      // Активные значения запросов
      actVals: {},
      
      isAct: function( value ) {
        return !arguments.length
          ? !!this.act.length
          : !!this.actVals[ value ] && SGUtils.hasOwn( this.actVals, value );
      },
      
      /**
       * Добавляет запрос в стек. Еслиесть настройка максимального кол-ва одновременных запросов,
       *  то будет отменен первый в стеке
       * @param {Object} item Экземпляр транспорта, которым был отправлен запрос
       * @param {String} value Запрос, который был отправлен
       * @return {Number}
       */
      add: function( item, value ) {
        var activeRequests = this.act,
          stackSize = options.reqMax || options.ajax.stackSize;
        if( stackSize && activeRequests.length && activeRequests.length >= stackSize ) {
          this.rm( activeRequests[ 0 ] );
        }
        this.actVals[ value ] = item;
        return activeRequests.push( item );
      },
      
      
      /**
       * Удаляет запрос из стека активных запросов
       * @param {Object} item Экземпляр транспорта
       * @return {Number}
       */
      rm: function( item ) {
        if( !item ) {
          return;
        }
        
        item.abort();
        
        var found = SGUtils.indexOf( this.act, item );
        if( ~found ) {
          this.act.splice( found, 1 );
        }
        
        var activeValues = this.actVals;
        for( found in activeValues ) {
          if( activeValues[ found ] === item ) {
            delete activeValues[ found ];
            break;
          }
        }
        
        return this.act.length;
      },
      
      
      /**
       * Отменяет все запросы в стеке
       * @return {Void}
       */
      abortAll: function() {
        var activeRequests = this.act,
          activeValues = this.actVals;
        for( var l = activeRequests.length; l--; ) {
          activeRequests[ l ] && activeRequests[ l ].abort();
        }
        
        activeRequests.length = 0;
        
        for( l in activeValues ) {
          delete activeValues[ l ];
        }
      },
      
      /**
       * Возвращает массив активных запросов
       * @return {Array}
       */
      stack: function() {
        return SGUtils.mkarr( this.act );
      },
      
      /**
       * Отправляет запрос на обработку
       * @param {String} value Запрос
       * @return {Void}
       */
      send: function( value, onSuccess, onError ) {
        if( !value ) {
          return false;
        }
        
        var self = this,
          transport,
          transportOptions = {},
          url = options.url,
          replacement = {
            "query": value
          };
        
        if( options.cch && cache.has( value ) ) {
          onSuccess && onSuccess( cache.get( value ), value );
          return true;
        }
        
        if( this.isAct( value ) ) {
          fireEvent( SuggestEvents.blockRequest, [ "running", value ] );
          return false;
        }
        
        
        if( typeof url === "object" ) {
          url = SGUtils.url( SGUtils.objFormat( url, replacement ) );
        } else {
          replacement.query = urlEncode( replacement.query ); 
          url = SGUtils.format( url, replacement );
        }
        
        // new options format
        if( options.ajax ) {
          extend( true, transportOptions, options.ajax );
        }
        
        //  deprecated options for transport
        var migrationOptions = {
          dataType: options.reqDataType,
          timeout: options.reqTimeout,
          jsonp: options.callbackParam,
          scriptCharset: options.scriptCharset,
          data: options.reqData
        };
        
        // make options
        for( var k in migrationOptions ) {
          if( migrationOptions[ k ] != null ) {
            transportOptions[ k ] = migrationOptions[ k ];
          }
        }
        
        // create transport
        transport = Suggest.Ajax( url, transportOptions );
        
        transport.on("success", function( event, response ) {
          // Возбуждаем событие получения данных
          fireEvent( SuggestEvents.successRequest, [ response, value ] );
          
          // Возбуждаем событие завершения запроса
          fireEvent( SuggestEvents.completeRequest, [ response, value ] );
          
          var dataFilter = options.dataFilter;
          if( isFunction( dataFilter ) ) {
            response = dataFilter.call( self, response, value );
          }
          
          // Удаляем объект запроса из стека
          if( !self.rm( transport ) ) {
            fireEvent( SuggestEvents.stopRequest, [ value ] );
          }
          
          if( options.cch ) {
            // Пишем в кэш ответ от сервера
            cache.set( value, response );
          }
          
          // Вызываем callback
          if( onSuccess ) {
            onSuccess( response, value );
          }
        });
        transport.on("error", function( event, status, statusText ) {
          var reason = statusText;
          
          // Возбуждаем событие получения данных
          fireEvent( SuggestEvents.errorRequest, [ reason, value ] );
          
          // Возбуждаем событие завершения запроса
          fireEvent( SuggestEvents.completeRequest, [ reason, value ] );
          
          // Удаляем объект запроса из стека
          if( !self.rm( transport ) ) {
            fireEvent( SuggestEvents.stopRequest, [ value ] );
          }
          
          // Вызываем errback
          if( onError ) {
            onError( reason, value );
          }
        });
        
        // Добавляем запрос в стек
        if( self.add( transport, value ) == 1 ) {
          fireEvent( SuggestEvents.startRequest, [ value ] );
        }
        
        // Возбуждаем событие отправки данных
        fireEvent( SuggestEvents.sendRequest, [ value ] );
        
        // Отправляем
        transport.send();

        return true;
      }
    };
  
    
  /**
   * 
   */ 
  function checkValue( value ) {
    value = String( value );
    var length = value.length,
      pass = true;
    if( options.valMin && length < options.valMin ||
      options.valMax && length > options.valMax )
    {
      pass = false;
    }
    
    var valFilter = options.valFilter;
    if( pass && valFilter ) {
      pass = valFilter instanceof RegExp
        ? valFilter.test( value )
        : isFunction( valFilter )
          ? valFilter( value )
          : valFilter === value;
    }
    return pass;
  }
    
  
  /**
   * Функция обработки запроса
   * @param {String} value Запрос, которые следует отфильтровать и обработать
   * @return void
   */
  function handleValue( value, callback ) {
    var checkPassed = checkValue( value );
    
    // Проверяем, прошло ли значение фильтры
    if( checkPassed ) {
      
      fireEvent( SuggestEvents.passFilter, [ value ] );
      
      // Отправляем запрос
      request.send(
        value,
        function( data, value ) {
          if( callback ) {
            callback( "success", data, value );
          } else { 
            if( value === getVal() ) {
              view( value, data );
            }
          }
        },
        function( reason, value ) {
          if( callback ) {
            callback( "error", reason, value );
          } else {
            if( value === getVal() ) {
              viewDataReset();
              close();
            }
          }
        }
      );
    
    } else {
      
      fireEvent( SuggestEvents.failFilter, [ value ] );
      
      if( callback ) {
        callback( "error", "filter", value );
      } else {
        viewDataReset();
        close();
      }
      
    }
  }


  var viewData = null,
    viewItemsData = null,
    viewValue = null;
  function view( value, data ) {
    var getData = options.dataGet;
    
    viewValue = value;
    viewData = data;
    viewItemsData = viewData && isFunction( getData ) ? getData.call( self, viewData ) : viewData;
    
    var needClose = false;
    if( !viewData ||
      !viewItemsData ||
      !viewItemsData.length ||
      options.min && options.min > viewItemsData.length )
    {
      needClose = true;
    }
    
    if( needClose ) {
      fireEvent( SuggestEvents.rejectData, [ data, value ] );
      
      // Сбрасываем все данные как не прошедшие фильтры
      viewDataReset();
      
      close();
    } else {
      fireEvent( SuggestEvents.acceptData, [ data, value ] );
      
      // Отправляемся рендерить список
      viewRender();
      
      open();
    }
  }
  
  
  function viewDataReset() {
    viewData = viewItemsData = viewValue = null;
    resetItemsFlags();
  }
  
  
  
  
  function viewListClear() {
    SGUtils.empty( $list );
    $items.length = 0;
    resetItemsFlags();
  }
  
  
  function resetItemsFlags() {
    $hovered =
    $focused =
    $selected =
    selectMethod = null;
    viewItemMouseWasMoved = false;
  }
  
  
  function viewRender() {
    viewListClear();
    
    // Сигнализируем, что мы отрендерили список
    fireEvent( SuggestEvents.render, [ viewItemsData, viewValue ] );
    
    var l = options.max ? Math.min( viewItemsData.length, options.max ) : viewItemsData.length,
      i = 0,
      itemData,
      $item,
      builderData,
      builderExtraData,
      itemBuilder = isFunction( options.item ) ? options.item : SGUtils.tmpl( options.item );
    
    if( options.itemExtraData && SGUtils.isObj(options.itemExtraData)) {
      builderExtraData = options.itemExtraData;
    }
    
    for( ; i < l; i++ ) {
      itemData = viewItemsData[ i ];
      
      builderData = {
        itemData: itemData,
        fullData: viewData,
        index: i,
        value: viewValue
      };
      if( builderExtraData ) {
        SGUtils.ext(builderData, builderExtraData);
      }
      
      $item = itemBuilder.call( self, builderData );
      
      if( $item && typeof $item === "string" ) {
        $item = SGUtils.cre( $item );
      }
      
      if( !$item || !$item.nodeType ) {
        break;
      }
      
      // Обработчики событий
      Evt.add( $item, "click", viewItemMouseSelect );
      Evt.add( $item, "mouseenter", viewItemMouseOver );
      Evt.add( $item, "mouseleave", viewItemMouseOut );
      Evt.add( $item, "mousedown", viewItemMouseDown );
      Evt.add( $item, "mouseup", viewItemMouseUp );
      Evt.add( $item, "mousemove", viewItemMouseMove );
      
      // Добавляем в коллекцию
      $items.push( $item );
      // Добавляем node блок
      $list.appendChild( $item );
    }
    
    // Сигнализируем, что мы отрендерили список
    fireEvent( SuggestEvents.renderEnd, [ $items, viewItemsData, viewValue ] );
  }
  
  
  var viewItemMouseWasMoved = false;
  
  function itemHoverByMouse( event ) {
    var node = event.currentTarget,
        index;
    if( options.mousePreview ) {
      index = getIndex( node );
      focus( index );
      previewResult( index );
    } else {
      resetFocus();
      hover( node );
    }
  }

  /**
   * 
   */
  function viewItemMouseOver( event ) {
    if( !viewItemMouseWasMoved ) {
      return;
    }
    itemHoverByMouse( event );
  }
  
  
  /**
   * FIXME
   */
  function viewItemMouseOut( event ) {
    
  }
  
  
  /**
   * 
   */
  function viewItemMouseDown() {
    
  }
  
  
  /**
   * 
   */
  function viewItemMouseUp() {
  
  }
  

  /**
   * 
   */
  function viewItemMouseMove( event ) {
    if( !viewItemMouseWasMoved ) {
      itemHoverByMouse( event );
    }
    viewItemMouseWasMoved = true;
  }
  
  
  function viewItemMouseSelect( event ) {
    event.stopPropagation();
    event.preventDefault();
    var $item = event.currentTarget,
      index = getIndex( $item );
    if( index != -1 ) {
      selectMethod = "mouse";
      select( index );
    }
  }
  
  
  function layerCorrection() {
    if( /^(?:relative|absolute|fixed)$/i.test( SGUtils.css( $container, "position" ) ) ) {
      var bounds = extend( {}, $field.getBoundingClientRect() );
      bounds.left += window.pageXOffset + ( options.shiftX || 0 );
      bounds.top += window.pageYOffset + $field.offsetHeight + ( options.shiftY || 0 );
      SGUtils.css( $container, "left", bounds.left + "px" );
      SGUtils.css( $container, "top", bounds.top + "px" );
    }
  }
  
  
  var turnNativeAutocompleteTimer;
  function turnNativeAutocomplete( turn ) {
    function stopReFocus () {
      if( turnNativeAutocompleteTimer ) {
        clearTimeout( turnNativeAutocompleteTimer );
        turnNativeAutocompleteTimer = null;
      }
    }
    
    // disable native autocomplete
    turn = turn ? "on" : "off";
    SGUtils.attr( $field, "autocomplete", turn );
    SGUtils.attr( $field, "autocapitalize", turn );
    SGUtils.attr( $field, "autocorrect", turn );
    
    // если фокус до инициализации уже был на инпуте,
    // то сбрасываем его и выставляем заново через некоторое время,
    // чтобы браузер подхватил autocomplete=on|off
    stopReFocus();
    if( SGUtils.hasFocus( $field ) ) {
      $field.blur();
      turnNativeAutocompleteTimer = setTimeout(function() {
        if( !document.activeElement ||
          !/^(?:a|input|textarea|select|button|)$/i.test( document.activeElement.tagName ) ||
          SGUtils.hasFocus( $field ) )
        {
          $field.focus();
        }
        
        stopReFocus();
      }, 25 );
    }
  }
  
  
  var fieldBlurTimeout;
  
  /**
   * 
   */
  function fieldBlurTimeoutClear() {
    clearTimeout(fieldBlurTimeout);
    fieldBlurTimeout = null;
  }
  
  
  /**
   * 
   */
  function eventFieldFocus() {
    fieldBlurTimeoutClear();
  }
  
  
  /**
   * 
   */
  function eventFieldBlur() {
    fieldBlurTimeout = setTimeout(function() {
      if( $mousepressed ) {
        eventFieldBlur(); 
      } else {
        fieldBlurTimeoutClear();
        close();
      }
    }, 50 );
  }
  
  
  /**
   * 
   */
  function eventContainerMDown() {
    $mousepressed = true;
  }
  
  
  /**
   * 
   */
  function eventContainerMUp() {
    $mousepressed = false;
    Evt.fire( $field, "focus" );
  }
  
  
  var keyDownDelayTimeout;
  
  /**
   * 
   */
  function keyDownDelayClear() {
    clearTimeout( keyDownDelayTimeout );
    keyDownDelayTimeout = null;
  }
  
  
  /**
   * 
   */
  function eventFieldKeyDown( event ) {
    var keyCode = event.keyCode,
      shiftKey = event.shiftKey,
      ctrlKey = event.ctrlKey,
      altKey = event.altKey,
      notCtrlShift = !ctrlKey && !shiftKey;
      
    // Проверки без задержки
    switch( true ) {
      // fix chrome cursor position feature
      case ( notCtrlShift && ( keyCode == 38 || keyCode == 40 ) && !isClosed() ):
        event.preventDefault();
      break;
    }
    
    // abort handle if delay not cancel
    if( keyDownDelayTimeout ) {
      return;
    }
    keyDownDelayTimeout = setTimeout( keyDownDelayClear, options.keynavDelay );

    var focusMovedByUpDown = false;
    
    switch( true ) {
      // Enter
      case ( keyCode == 13 ):
        if( !isClosed() && $focused ) {
          selectMethod = "keyboard";
          var selectApproved = select( $focused, true );
          
          if( !options.autoSubmit || selectApproved === false ) {
            event.preventDefault();
          }
        }
        break;
      
      // Esc
      case ( keyCode == 27 ):
        if( !isClosed() ) {
          close();
          revertResult();
          
          // Для FF. Если на запросе было выделение, то он его сохраняет,
          // поэтому нужно сбросить немного подождав
          setTimeout( revertResult, 15 );
          event.preventDefault();
        }
        break;
      
      // arrow up
      case ( notCtrlShift && keyCode == 38 ):
        if( !isClosed() ) {
          moveFocus( -1 );
          
          focusMovedByUpDown = true;
        }
        break;
      
      // arrow right
      case ( notCtrlShift && keyCode == 39 ):
        if( !isClosed() && checkData() &&
          $focused && getResult( $focused ) !== viewValue )
        {
          show( getResult( $focused ) );
        }
        break;
      
      // arrow down
      case ( notCtrlShift && keyCode == 40 ):
        if( !isClosed() ) {
          moveFocus( 1 );
          focusMovedByUpDown = true;
        } else {
          if( checkData() && $focused ) {
            open();
            focusMovedByUpDown = true;
          } else {
            show();
          }
        }

        break;
    }

    if( focusMovedByUpDown && options.preview ) {
      if( $focused ) {
        previewResult( getIndex( $focused ) );
      } else {
        revertResult()
      }
    }
  }
  
  
  /**
   * 
   */
  function eventFieldKeyUp( event ) {
    keyDownDelayClear();
  }
  
  
  
  
  /**
   * 
   */
  function checkData() {
    return viewData != null && viewItemsData != null && viewValue != null;  
  }
  
  
  /**
   * 
   */
  function getIndex( item ) {
    var index;
    if( typeof item === "number" ) {
      index = item;
    } else if ( item && item.nodeType ) {
      index = SGUtils.indexOf( $items, item );
    }
    return typeof index === "number" && !isNaN( index ) ? index : -1;
  }
  
  
  /**
   * 
   */
  function getItem( index ) {
    var item;
    if( typeof index === "number" ) {
      item = $items[ index ];
    } else if ( index && index.nodeType && ~( index = SGUtils.indexOf( $items, index ) ) ) {
      item = $items[ index ];
    }
    return item || null;
  }
  
  
  /**
   * 
   */
  function getData() {
    return viewData;
  }
  
  
  /**
   * 
   */
  function getItemData( index ) {
    index = getIndex( index );
    return viewItemsData && viewItemsData[ index ] != null ? viewItemsData[ index ] : null;  
  }
  
  
  /**
   * 
   */
  function hover( index ) {
    var $item = getItem( index ),
      hover = options.hover,
      index;
    
    if( !$hovered && !$item || $hovered === $item ) {
      return;
    }

    if( hover ) {
      if( typeof hover === "string" ) {
        
        $hovered && SGUtils.rmCls( $hovered, hover );
        $item && SGUtils.addCls( $item, hover );
        
      } else if( isFunction( hover ) ) {
        
        if( $hovered ) {
          index = getIndex( $hovered );
          hover.call( self, false, $hovered, getItemData( index ), index, viewValue );
        }
        
        if( $item ) {
          index = getIndex( $item );
          hover.call( self, true, $item, getItemData( index ), index, viewValue );
        }
        
      } 
    }
    
    $hovered = $item;
  }
  
  
  /**
   * 
   */
  function focus( index, /* only internal use */ _showPreview ) {
    index = getIndex( index );
    var $item = getItem( index ),
      itemData = getItemData( index );
    
    hover( index );
    
    // Сигнализируем о начале выделении конкретного саджеста
    fireEvent( SuggestEvents.focus, [ itemData, index, viewValue ] );
      
    $focused = $item;
    
    // if( options.preview ) {
    //   previewResult( index );
    // }
    
    // Сигнализируем о выделении конкретного саджеста
    fireEvent( SuggestEvents.focusEnd, [ itemData, index, viewValue ] );
  }
  
  
  /**
   * 
   */
  function moveFocus( step ) {
    var $elem = $focused || $hovered,
      first = -1,
      currentIndex = $elem ? getIndex( $elem ) : first,
      last = $items.length - 1,
      next = currentIndex + step;
    if( next < first ) {
      next = last;
    } else if( next > last ) {
      next = first;
    }
    
    focus( next );
  }
  
  
  /**
   * 
   */
  function resetFocus() {
    $focused = null;
  }
  
  
  /**
   * TODO
   */
  function getResult( index ) {
    index = getIndex( index );
    var itemData = getItemData( index );
    return itemData != null ? options.result.call( self, itemData, index, viewData, viewValue ) : null;
  }
  
  
  /**
   * TODO
   */
  function result( index ) {
    index = getIndex( index );
    var value = getResult( index );
    if( value ) {
      checker.setIgnore( value );
    }
    return value;
  }
  
  
  /**
   * 
   */
  function previewResult( index ) {
    index = getIndex( index );
    var itemData = getItemData( index ),
      value = itemData != null ? options.result( itemData, index, getData(), viewValue ) : viewValue;
    checker.setIgnore( value );
  }
  
  
  /**
   * TODO
   */
  function revertResult() {
    checker.setIgnore( viewValue );
    setVal( viewValue );
  }
  
  
  /**
   * Выбор и выделение определенного саджеста по индексу
   * @param {Number} index
   * @return void
   */
  function select( index, submitAlreadyTriggered /* Internal use only */ ) {
    // Получаем индекс
    index = getIndex( index );
    
    $selected = index == -1 ? null : getItem( index );
    
    focus( index );
    
    var data = getData(),
      itemData = getItemData( index ),
      select_handler = options.select,
      retSelect,
      lazySelectEnd = false;
    
    // Сигнализиуем о начале выборе определенного саджеста
    fireEvent( SuggestEvents.select, getState() );
      
    // Закрываем саджест
    close();
    // Возвращаем изначальный запрос, если вдруг он был изменен предварительный просмотром запроса.
    revertResult();
    
    if( isFunction( select_handler ) ) {
      retSelect = select_handler.call( self, getState() );
    }
    
    if( retSelect !== false ) {
      // вонзаем результат из саджеста
      result( index );
      
      // Если есть настройка, то принудительно сабмитим форму
      if( $form && options.autoSubmit ) {
        if( !submitAlreadyTriggered ) {
          // Evt.fire( $form, "submit" );
          
          var EventObject,
            defaultPrevented = false;
          if( document.createEvent ) { // Other browsers
            // Этот ад нужен для того, чтобы Firefox вел себя по стандартам.
            // dispatchEvent не должен сабмитить форму.
            // Используем нативное навешивание события, чтобы хендлер вызвался гарантированно последним
            Evt.natOne( $form, "submit", function( event ) {
              event = event || window.event;
              defaultPrevented = Evt.natIsDefaultPrevented( event );
              
              Evt.Event.prototype.preventDefault.call({
                origEvt: event
              });
            });
            EventObject = document.createEvent("HTMLEvents");
            EventObject.initEvent( "submit", false, true );
            $form.dispatchEvent( EventObject );
          } else if( document.createEventObject ) { // < IE9  
            
            EventObject = document.createEventObject();
            defaultPrevented = !$form.fireEvent( "onsubmit", EventObject );
            
          }
          
          // Если сабмит не был отменен, то сабмитим форму
          if( defaultPrevented === false ) {
            $form.submit();
          }
          
        } else {
          
          // Ставим признак того, что сабмит еще не произошел
          lazySelectEnd = true;
          
        }
      }
    }
    
    if( !lazySelectEnd ) {
      selectEnd();
    } else {
      // Используем нативное навешивание события, чтобы хендлер вызвался гарантированно последним
      if( "addEventListener" in document ) {
        Evt.natOne( $form, "submit", selectEnd );
      } else {
        // Для гребанного IE вызываем хендлер по таймауту,
        // т.к. вызов хендлеров навешанных на событие происходит в обратном порядке
        // т.е. навешанный последним хендлер будет вызван первым. WTF?!
        Evt.natOne( $form, "submit", function() {
          setTimeout( selectEnd, 50 );
        });
      }
    }
    
    return retSelect;
  }
  
  
  /**
   * 
   */
  function selectEnd() {
    var unselect_handler = options.unselect;
    if( isFunction( unselect_handler ) ) {
      unselect_handler.call( self, getState() );
    }
    
    // Сигнализиуем о выборе определенного саджеста
    fireEvent( SuggestEvents.selectEnd, getState() );
    
    // Стираем маркер выбранного саджеста
    $selected =
    selectMethod = null;
  }
  
  
  /**
   * 
   */
  function show( value ) {
    // if( checkData() && ( !value || value === viewValue ) ) {
    //   open();
    //   // if( $focused ) {
    //   //   focus( $focused );
    //   // }
    // } else
    if( value ) {
      checker.fireVal( value, true ); 
    } else {
      checker.fire( true );
    }
  }
  
  
  /**
   * Проверяет, скрыт ли блок.
   * @return void
   */
  function isClosed() {
    var ret = true,
      switcher = options.switcher,
      switchChecker = options.switchChecker;
    if( switcher ) {
      if( typeof switcher === "string" ) {
        ret = !SGUtils.hasCls( $container, options.switcher );
      } else if( isFunction( switcher ) && isFunction( switchChecker ) ) {
        ret = !switchChecker.call( self );
      }
    } else {
      ret = SGUtils.css( $container, "display" ) === "none";
    }
    
    return ret;
  }
  
  
  /**
   * Показывает блок с саджестами
   * @return void
   */
  function open() {
    if( isClosed()  ) {
      fireEvent( SuggestEvents.open, [ viewValue ] );
      
      var switcher = options.switcher;
      if( !switcher ) {
        SGUtils.css( $container, "display", "block" );
      } else if( typeof switcher === "string" ) {
        SGUtils.addCls( $container, switcher );
      } else if( isFunction( switcher ) ) {
        switcher.call( self, true, $container );
      }
      
      if( options.correction ) {
        layerCorrection();
      }

      viewItemMouseWasMoved = false;
      
      fireEvent( SuggestEvents.openEnd, [ viewValue ] );
    }
  }
  
  
  /**
   * Скрывает блок с саджестами
   * @return void
   */
  function close() {
    if( !isClosed() ) {
      fireEvent( SuggestEvents.close, [ viewValue ] );
      
      var switcher = options.switcher;
      if( !switcher ) {
        SGUtils.css( $container, "display", "none" );
      } else if( typeof switcher === "string" ) {
        SGUtils.rmCls( $container, switcher );
      } else if( isFunction( switcher ) ) {
        switcher( false, $container );
      }
      
      fireEvent( SuggestEvents.closeEnd, [ viewValue ] );
    }
  }
  
  
  // Закрываем саджест, если кликнули в любую область документа
  function eventDocumentClick( event ){
    if( event.target !== $field ) {
      close();
    }
  }
  function eventWindowResize() {
    layerCorrection();
  }
  function addNodeHandlers() {
    Evt.add( document, "click", eventDocumentClick );
    
    // Стопим всплытие клика на контейнере саджестов, чтобы он не закрылся
    Evt.add( $container, "click", fnFALSE );
    
    // focus/blur event handlers
    Evt.add( $field, "focus", eventFieldFocus );
    Evt.add( $field, "blur", eventFieldBlur );
    Evt.add( $container, "mousedown", eventContainerMDown );
    Evt.add( $container, "mouseup", eventContainerMUp );
    
    // Обработчики клавиатурного управления
    Evt.add( $field, "keydown", eventFieldKeyDown );
    Evt.add( $field, "keyup", eventFieldKeyUp );
    
    // Коррекция  расположения блока саджестов
    if( options.correction ) {
      Evt.add( window, "resize", eventWindowResize );
    }
  }
  
  function removeNodeHandlers() {
    // Сносим все саджестовые обработчики на нодах
    Evt.rm( document, "click", eventDocumentClick );
    
    // Клик на блок саджестов
    Evt.rm( $container, "click", fnFALSE );
    
    // focus/blur event handlers
    Evt.rm( $field, "focus", eventFieldFocus );
    Evt.rm( $field, "blur", eventFieldBlur );
    Evt.rm( $container, "mousedown", eventContainerMDown );
    Evt.rm( $container, "mouseup", eventContainerMUp );
    
    // Обработчик клавиатурного управления
    Evt.rm( $field, "keydown", eventFieldKeyDown );
    Evt.rm( $field, "keyup", eventFieldKeyUp );
    
    if( options.correction && eventWindowResize ) {
      Evt.rm( window, "resize", eventWindowResize );
    }
  }
  
  /**
   * Включает саджест
   */
  function enable() {
    if( disabled ) {
      fireEvent( SuggestEvents.enable );
      
      // Навешиваем обработчики событий на элементы
      addNodeHandlers();
      
      // Отключаем нативный автокомплит
      turnNativeAutocomplete( false );
      
      // Начинаем проверку инпута
      checker.init();
      
      // Ставим флажек, что саджест включен
      disabled = false;
      
      fireEvent( SuggestEvents.enableEnd );
    }
  }
  
  
  /**
   * Выключает саджест
   */
  function disable() {
    if( !disabled ) {
      fireEvent( SuggestEvents.disable );
      
      // Закрываем саджест
      close();
      
      // Останавливаем проверку инпута
      checker.off();
      
      // Останавливаем все активные запросы
      request.abortAll();
      
      // Включаем нативный автокомплит
      turnNativeAutocomplete( true );
      
      // Сносим все обработчики событий с элементов
      removeNodeHandlers();
      
      // Стираем список подсказок
      viewListClear();
      
      // Ставим флажек, что саджест выключен
      disabled = true;
      
      fireEvent( SuggestEvents.disableEnd );
    }
  }
  
  
  /**
   * Проверяет, отключен ли саджест в данный момент.
   * Возвращает true, если саджест отключен, иначе false
   * @return {Boolean} 
   */
  function isDisabled() {
    return disabled;  
  }
  
  
  /**
   * Сносит все обработчики на экзмпляре, элементах и сами элементы, которые были динамически созданы.
   */
  function destroy() {
    fireEvent( SuggestEvents.destroy );
    
    // Отключаем саджест
    disable();
    
    if( options.cch ) {
      // Очищаем кэш
      cache.flush();
    }
    
    // Сносим все обработчики на экземпляре
    removeEvent();
    
    fireEvent( SuggestEvents.destroyEnd );
    
    delete Suggest.instances[ self.guid ];
  }
  
  
  /**
   * 
   */
  function debugEventHandler( event ) {
    try {
      console.log( event.type, arguments );
    } catch(e) {}
  }
  
  
  
  var options = {};
  
  function prepareOptions( options ) {
    if( options == null ) {
      return null;
    }
    
    var ret = {};
    (function chain( obj, prefix ) {
      if( obj != null ) {
        if( SGUtils.isObj( obj ) ) {
          SGUtils.objEach( obj, function( value, prop ) {
            chain( value, ( prefix ? prefix + "." : "" ) + prop );
          });
        } else if( prefix ) {
          ret[ prefix ] = obj;
        }
      }
    })( options );
    
    return ret;
  }
  
  /**
   * 
   */
  function opts( option, value ) {
    var argsLength = arguments.length;
    if( argsLength == 0 ) {
      return options;
    }
    if( argsLength == 1 && typeof option !== "object" ) {
      return SGUtils.walker( options, option );
    }
    
    if( typeof option !== "object" ) {
      var obj = {};
      obj[ option ] = value;
      option = obj;
    }
    
    var prepared = prepareOptions( option );
    
    if( prepared ) {
      SGUtils.objEach( prepared, function( value, option ) {
        var prevValue = SGUtils.walker( options, option, value );
        applyOpt( option, value, prevValue );
      });
    }
  }
  
  function applyOpt( optName, value, prev ) {
    if( /(?:^on[A-Z])/.test( optName.substr( 0, 3 ) ) && isFunction( value ) ) {
      var eventType = optName.charAt( 2 ).toLowerCase() + optName.slice( 3 );
      if( ( eventType = Suggest.evt[ eventType ] ) ) {
        if( prev ) {
          removeEvent( eventType, prev );
        }
        addEvent( eventType, value );
      }
    }
  }
  
  // Применяем переданные настройки
  inputOptions = extend( true, {}, Suggest.opts, inputOptions );
  opts( inputOptions );
  
  
  var 
    // Получаем инпут, к которому и подцепиться саджест
    $field = options.field && SGUtils.$( options.field ),
    
    // Форма, в которой находится инпут
    $form = $field && $field.form,
    
    // Контейнер, который будет показываться при получении саджестов
    $container = SGUtils.$( options.cont ),
    
    // Контейнер, к который будет строиться список подсказок
    $list = options.list && $container
      ? SGUtils.$( options.list, $container )
      : $container,
    
    // Элементы подсказок
    $items = [],
    
    // Прокрашенный саджест
    $hovered,
    
    // Выделенный саджест
    $focused,
    
    // Выбранный саджест
    $selected,
    
    // Нажатый блок саджеста
    $mousepressed,
    
    // Отключен ли саджест
    disabled = true,
    
    // TODO
    // Запрещено ли открытие саджеста
    openingCanceled = false,
    
    selectMethod = null;
    
    
  if( !$field || !$container || !$list ) {
    throw "";
  }
  
  
  // Если включен дебаг, то логируем все внутренние события
  if( options.debug ) {
    SGUtils.objEach(
      SuggestEvents,
      function( eventType ) {
        addEvent( eventType, debugEventHandler );
      }
    );
  }
  
  
  // External interface
  extend( self, {
    // nodes
    field: $field,
    form: $form,
    cont: $container,
    list: $list, 
    
    // methods
    show: show,
    focus: focus,
    moveFocus: moveFocus,
    select: select,
    open: open,
    close: close,
    isClosed: isClosed,
    enable: enable,
    disable: disable,
    isDisabled: isDisabled,
    destroy: destroy,
    on: addEvent,
    off: removeEvent,
    getState: getState,
    opts: opts,
    flushCache: function() {
      cache.flush();
    }
  });
  
  self.guid = getGUID();
  Suggest.instances[ self.guid ] = self;
  
  // Включаем сразу, если есть такая настройка
  if( options.enabled ) {
    enable();
  }
}


// Internal events
var SuggestEvents = Suggest.evt = {};
SGUtils.arrEach(
  ( "open openEnd close closeEnd enable enableEnd disable disableEnd destroy destroyEnd " +
    "blockRequest successRequest completeRequest stopRequest errorRequest startRequest " +
    "sendRequest passFilter failFilter rejectData acceptData render renderEnd " +
    "focus focusEnd select selectEnd valueChange flushCache flushCacheEnd setCache " +
    "setCacheEnd getCache getCacheEnd" ).split(" "),
  function( eventType ){
    this[ eventType ] = eventType;
  },
  SuggestEvents
);

// Все экземпляры
Suggest.instances = {};

// Настройки по умолчанию
Suggest.opts = {
  enabled: true,
  // field: "#q",
  cont: "#sg, .sg",
  // list: ".sg-items",
  // correction: true,
  // shiftX: 0,
  // shiftY: 0,
  // switcher: "sg-open",
  // switchChecker: function( container ) {},
  delay: 250,
  valMin: 1,
  valMax: 255,
  valFilter: /(?:\S)/,
  url: "http://suggests.go.mail.ru/sg_u?q={query}",
  ajax: {
    dataType: "jsonp",
    jsonp: "callback",
    scriptCharset: "utf-8",
    timeout: 5000,
    stackSize: 2
  },
  // callbackParam: "callback",
  // reqTimeout: 5000,
  // reqMax: 2,
  // reqDataType: "jsonp",
  // reqData: {},
  // scriptCharset: "utf-8",
  dataFilter: function( data ) {
    return data;
  },
  dataGet: function( data ){
    return data && data.items ? data.items : [];
  },
  cch: true,
  cchLimit: 128,
  max: 10,
  min: 0,
  autoSubmit: true,
  hover: "sg__item_hover",
  // itemExtraData: {"foo": "bar"},
  item: '<div class="sg__item"><%= itemData.textMarked %></div>',
  result: function( itemData ) {
    return itemData.text;
  },
  select: function() {
    
  },
  keynavDelay: 150,
  preview: true,
  mousePreview: false,
  debug: false
};

/**
 * Уставливает глобальные настройки
 * @param {Object} options 
 */
Suggest.setup = function( options ) {
  extend( true, Suggest.opts, options );
};


// Шарим все, что может понадобиться
Suggest.expando = EXPANDO;
Suggest.guid = getGUID;
Suggest.now = now;
Suggest.utils = SGUtils;
Suggest.tmpl = SGUtils.tmpl;

// Расшариваем в window
window.SG = window.SG || Suggest;


})( window );
