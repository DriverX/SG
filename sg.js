(function( window, undefined ) {
  
var 
  document = window.document,

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
  Object__keys = Object.keys,
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
      ret = str.replace(/^\s+|\s+$/g, "");
    }
    return ret;
  },


  /**
   *
   */
  camelCase: function( str ) {
    var ret;
    str = String( str );
    ret = str.replace(/[\s\-_]+([\w\d])/g, function(f, $1) {
      return $1.toUpperCase();
    });
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
   *
   */
  keys: Object__keys || function( obj ) {
    var ret = [],
      k;
    for( k in obj ) {
      if( SGUtils.hasOwn( obj, k ) ) {
        ret.push( k );
      }
    }
    return ret
  },

  
  /**
   * Обходит каждый элемент массива и создает
   */
  map: function( arr, fn, context ) {
    if( Array__map ) {
      return Array__map.call( arr, fn, context );
    }
    
    var i = 0,
      l = arr.length >>> 0,
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
      l = arr.length >>> 0;
    
    if( from < l ) {
      if( from < 0 ) {
        i = Math.max( l - Math.abs( from ), 0 );
      } else {
      	i = from;
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
      l,
      isString = typeof arrayLike === "string";
    if( arrayLike && ( l = arrayLike.length ) !== undefined ) {
      if( !isString ) {
        try {
          arr = Array__slice.call( arrayLike );
        } catch(e) {}
      }
      if( !arr || arr.length !== l ) {
      	arr = new Array( l );
      	if( isString ) {
      	  while( l-- ) {
            arr[ l ] = arrayLike.charAt( l );
          }
      	} else {
      	  while( l-- ) {
            if( l in arrayLike ) {
              arr[ l ] = arrayLike[ l ];
            }
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
      if( !key ) {
        continue;
      }
      if( SGUtils.hasOwn( obj, key ) ) {
        value = obj[ key ];
        if( value && SGUtils.isFn( value ) ) {
          value = value();
        }
        if( value != null ) {
          ret.push([ urlEncode( key ), urlEncode( value ) ].join("="));
        }
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
      return;
    }

    var ret;
    if( cssProp ) {
      cssProp = SGUtils.camelCase( cssProp );
      if( arguments.length > 2 ) {
        elem.style[ cssProp ] = value;
      } else {
        ret = curCSS( elem, cssProp );
      }
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
    attr = attr.toLowerCase();
    if( arguments.length > 2 ) {
      elem.setAttribute( attr, value );
    }

    var ret;
    if( attr in {"href": true, "src": true, "width": true, "height": true} ) {
      ret = elem.getAttribute( attr, 2 );
    } else {
      ret = elem.getAttribute( attr );
    }
    if( ret === null ) {
      ret = undefined;
    }
    return ret;
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
        transport.on("error", function( event, statusText ) {
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
      itemBuilder = isFunction( options.item ) ? options.item : Suggest.tmpl( options.item );
    
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
    
  if( !$field ) {
    throw "options.field not found";
  }
  if( !$container ) {
    throw "options.cont not found";
  }
  if( !$list ) {
    throw "options.list not found";
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
    _request: request,
    _checker: checker,

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
  ("open openEnd close closeEnd enable enableEnd disable " +
  "disableEnd destroy destroyEnd blockRequest successRequest " +
  "completeRequest stopRequest errorRequest startRequest " +
  "sendRequest passFilter failFilter rejectData acceptData render " +
  "renderEnd focus focusEnd select selectEnd valueChange flushCache " +
  "flushCacheEnd setCache setCacheEnd getCache getCacheEnd").split(" "),
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
Suggest.noop = emptyFn;
Suggest.utils = SGUtils;

// Расшариваем в window
window.SG = window.SG || Suggest;

})( window );

/**!
* YASS 0.3.8 - The fastest CSS selectors JavaScript library
*
* Copyright (c) 2008-2009 Nikolay Matsievsky aka sunnybear (webo.in),
* Dual licensed under the MIT (MIT-LICENSE.txt)
* and GPL (GPL-LICENSE.txt) licenses.
*/
(function( window, sg ){

var document = window.document,
  utils = sg.utils,
  makeArray = utils.mkarr;

/* cached check for getElementsByClassName */
var k = !!document.getElementsByClassName,

/* cached check for querySelectorAll. Disable all IE due to lask of support */
  q = !!document.querySelectorAll;


/**
 * Returns number of nodes or an empty array
 * @param {String} CSS selector
 * @param {DOM node} root to look into
 */
var _ = function (selector, root ) {
  /* sets of nodes, to handle comma-separated selectors */
  var sets = [];
  
  /* clean root with document */
  root = root ? _( root )[0] : document;
  
  if( !selector ) {
    return sets;
  }
  
  if(
    selector.nodeType || typeof selector === "object" && "setTimeout" in selector
  )
  {
    return [ selector ];
  }
  
  if( typeof selector === "object" && ( utils.isArr( selector )
      || selector.length !== undefined )
  )
  {
    return makeArray( selector );
  }
  
  if( !root ) {
    return sets;
  }
  

  selector = utils.trim( selector );
/* quick return or generic call, missed ~ in attributes selector */
  if( /^[\w#.][\w\-_]*$/.test( selector ) ) {
/*
some simple cases - only ID or only CLASS for the very first occurence
- don't need additional checks. Switch works as a hash.
*/
    var idx = 0;
/* the only call -- no cache, thx to GreLI */
    switch (selector.charAt(0)) {
      case '#':
        idx = selector.slice(1);
        sets = document.getElementById(idx);
/*
workaround with IE bug about returning element by name not by ID.
Solution completely changed, thx to deerua.
Get all matching elements with this id
*/
        if ( sets && sets.id !== idx) {
          sets = document.all[idx];
        }
        sets = sets ? [sets] : [];
        break;
      case '.':
        var klass = selector.slice(1);
        if ( k ) {
          sets = (idx = (sets = root.getElementsByClassName(klass)).length) ? sets : [];
        } else {
/* no RegExp, thx to DenVdmj */
          klass = ' ' + klass + ' ';
          var nodes = root.getElementsByTagName('*'),
            i = 0,
            node;
          while (node = nodes[i++]) {
            if ((' ' + node.className + ' ').indexOf(klass) != -1) {
              sets[idx++] = node;
            }

          }
          sets = idx ? sets : [];
        }
        break;
      default:
        sets = (idx = (sets = root.getElementsByTagName(selector)).length) ? sets : [];
        break;
    }
  } else {
    
    var failQuerySelectorAll = false,
      selectorFindNorEqual = ~selector.indexOf('!=');
/*
all other cases. Apply querySelector if exists.
All methods are called via . not [] - thx to arty
*/
    if( q && !selectorFindNorEqual ) {
/* replace not quoted args with quoted one -- Safari doesn't understand either */
      try {
        sets = root.querySelectorAll( selector.replace( /=([^\]]+)/, '="$1"' ) );
      } catch( e ) {
        failQuerySelectorAll = true;
      }
/* generic function for complicated selectors */
    }
    
    if( failQuerySelectorAll || !q || selectorFindNorEqual ) {
/* number of groups to merge or not result arrays */
/*
groups of selectors separated by commas.
Split by RegExp, thx to tenshi.
*/
      var groups = selector.split(/ *, */),
/* group counter */
        gl = groups.length - 1,
/* if we need to concat several groups */
        concat = !!gl,
        group,
        singles,
        singles_length,
/* to handle RegExp for single selector */
        single,
        i,
/* to remember ancestor call for next childs, default is " " */
        ancestor,
/* current set of nodes - to handle single selectors */
        nodes,
/* for inner looping */
        tag, id, klass, attr, eql, mod, ind, newNodes, idx, J, child, last, childs, item, h;
/* loop in groups, maybe the fastest way */
      while (group = groups[gl--]) {
/*
Split selectors by space - to form single group tag-id-class,
or to get heredity operator. Replace + in child modificators
to % to avoid collisions. Additional replace is required for IE.
Replace ~ in attributes to & to avoid collisions.
*/  
        singles_length = (singles = group.replace(/(\([^)]*)\+/,"$1%").replace(/(\[[^\]]+)~/,"$1&").replace(/(~|>|\+)/," $1 ").split(/ +/)).length;
        i = 0;
        ancestor = ' ';
/* is cleanded up with DOM root */
        nodes = [root];
/*
John's Resig fast replace works a bit slower than
simple exec. Thx to GreLI for 'greed' RegExp
*/
        while (single = singles[i++]) {
/* simple comparison is faster than hash */
          if (single !== ' ' && single !== '>' && single !== '~' && single !== '+' && nodes) {
            single = single.match(/([^[:.#]+)?(?:#([^[:.#]+))?(?:\.([^[:.]+))?(?:\[([^!&^*|$[:=]+)([!$^*|&]?=)?([^:\]]+)?\])?(?:\:([^(]+)(?:\(([^)]+)\))?)?/);
/* 
Get all required matches from exec:
tag, id, class, attribute, value, modificator, index.
*/
            tag = single[1] || '*';
            id = single[2];
            klass = single[3] ? ' ' + single[3] + ' ' : '';
/* new nodes array */
            newNodes = [];
/* 
cached length of new nodes array
and length of root nodes
*/
            idx = J = 0;
/* if we need to mark node with expando yeasss */
            last = i == singles_length;
/* loop in all root nodes */
            while (child = nodes[J++]) {
/*
find all TAGs or just return all possible neibours.
Find correct 'children' for given node. They can be
direct childs, neighbours or something else.
*/
              switch (ancestor) {
                case ' ':
                  childs = child.getElementsByTagName(tag);
                  h = 0;
                  while (item = childs[h++]) {
/*
check them for ID or Class. Also check for expando 'yeasss'
to filter non-selected elements. Typeof 'string' not added -
if we get element with name="id" it won't be equal to given ID string.
Also check for given attributes selector.
Modificator is either not set in the selector, or just has been nulled
by modificator functions hash.
*/
                    if ((!id || item.id === id) && (!klass || (' ' + item.className + ' ').indexOf(klass) != -1) && !item.yeasss) {
/* 
Need to define expando property to true for the last step.
Then mark selected element with expando
*/
                      if (last) {
                        item.yeasss = 1;
                      }
                      newNodes[idx++] = item;
                    }
                  }
                  break;
              }
            }
/* put selected nodes in local nodes' set */
            nodes = newNodes;
          } else {
/* switch ancestor ( , > , ~ , +) */
            ancestor = single;
          }
        }
        
        if (concat) {
/* if sets isn't an array - create new one */
          if (!nodes.concat) {
            newNodes = [];
            h = 0;
            while (item = nodes[h]) {
              newNodes[h++] = item;
            }
            nodes = newNodes;
/* concat is faster than simple looping */
          }
          sets = nodes.concat(sets.length == 1 ? sets[0] : sets);
        } else {
/* inialize sets with nodes */
          sets = nodes;
        }
      }
      
/* define sets length to clean up expando */
      idx = sets.length;
/*
Need this looping as far as we also have expando 'yeasss'
that must be nulled. Need this only to generic case
*/
      while (idx--) {
        sets[idx].yeasss = sets[idx].nodeIndex = sets[idx].nodeIndexLast = null;
      }
    }
  }
/* return and cache results */
  return makeArray( sets );
};


// share
sg.$ = utils.$ = function( mixed, context ) {
  return _( mixed, context )[ 0 ] || null;
};
sg.yass = sg.$$ = utils.$$ = _;

})( window, SG );

/**
 * A lightweight CommonJS Promises/A and when() implementation
 * when is part of the cujo.js family of libraries (http://cujojs.com/)
 *
 * Licensed under the MIT License at:
 * http://www.opensource.org/licenses/mit-license.php
 *
 * @version 1.7.1
 *
 * MIT License (c) copyright B Cavalier & J Hann
 */

(function(define) { 'use strict';
define(function () {
	var reduceArray, slice, undef;

	//
	// Public API
	//

	when.defer     = defer;     // Create a deferred
	when.resolve   = resolve;   // Create a resolved promise
	when.reject    = reject;    // Create a rejected promise

	when.join      = join;      // Join 2 or more promises

	when.all       = all;       // Resolve a list of promises
	when.map       = map;       // Array.map() for promises
	when.reduce    = reduce;    // Array.reduce() for promises

	when.any       = any;       // One-winner race
	when.some      = some;      // Multi-winner race

	when.chain     = chain;     // Make a promise trigger another resolver

	when.isPromise = isPromise; // Determine if a thing is a promise

	/**
	 * Register an observer for a promise or immediate value.
	 *
	 * @param {*} promiseOrValue
	 * @param {function?} [onFulfilled] callback to be called when promiseOrValue is
	 *   successfully fulfilled.  If promiseOrValue is an immediate value, callback
	 *   will be invoked immediately.
	 * @param {function?} [onRejected] callback to be called when promiseOrValue is
	 *   rejected.
	 * @param {function?} [onProgress] callback to be called when progress updates
	 *   are issued for promiseOrValue.
	 * @returns {Promise} a new {@link Promise} that will complete with the return
	 *   value of callback or errback or the completion value of promiseOrValue if
	 *   callback and/or errback is not supplied.
	 */
	function when(promiseOrValue, onFulfilled, onRejected, onProgress) {
		// Get a trusted promise for the input promiseOrValue, and then
		// register promise handlers
		return resolve(promiseOrValue).then(onFulfilled, onRejected, onProgress);
	}

	/**
	 * Returns promiseOrValue if promiseOrValue is a {@link Promise}, a new Promise if
	 * promiseOrValue is a foreign promise, or a new, already-fulfilled {@link Promise}
	 * whose value is promiseOrValue if promiseOrValue is an immediate value.
	 *
	 * @param {*} promiseOrValue
	 * @returns Guaranteed to return a trusted Promise.  If promiseOrValue is a when.js {@link Promise}
	 *   returns promiseOrValue, otherwise, returns a new, already-resolved, when.js {@link Promise}
	 *   whose resolution value is:
	 *   * the resolution value of promiseOrValue if it's a foreign promise, or
	 *   * promiseOrValue if it's a value
	 */
	function resolve(promiseOrValue) {
		var promise, deferred;

		if(promiseOrValue instanceof Promise) {
			// It's a when.js promise, so we trust it
			promise = promiseOrValue;

		} else {
			// It's not a when.js promise. See if it's a foreign promise or a value.
			if(isPromise(promiseOrValue)) {
				// It's a thenable, but we don't know where it came from, so don't trust
				// its implementation entirely.  Introduce a trusted middleman when.js promise
				deferred = defer();

				// IMPORTANT: This is the only place when.js should ever call .then() on an
				// untrusted promise. Don't expose the return value to the untrusted promise
				promiseOrValue.then(
					function(value)  { deferred.resolve(value); },
					function(reason) { deferred.reject(reason); },
					function(update) { deferred.progress(update); }
				);

				promise = deferred.promise;

			} else {
				// It's a value, not a promise.  Create a resolved promise for it.
				promise = fulfilled(promiseOrValue);
			}
		}

		return promise;
	}

	/**
	 * Returns a rejected promise for the supplied promiseOrValue.  The returned
	 * promise will be rejected with:
	 * - promiseOrValue, if it is a value, or
	 * - if promiseOrValue is a promise
	 *   - promiseOrValue's value after it is fulfilled
	 *   - promiseOrValue's reason after it is rejected
	 * @param {*} promiseOrValue the rejected value of the returned {@link Promise}
	 * @return {Promise} rejected {@link Promise}
	 */
	function reject(promiseOrValue) {
		return when(promiseOrValue, rejected);
	}

	/**
	 * Trusted Promise constructor.  A Promise created from this constructor is
	 * a trusted when.js promise.  Any other duck-typed promise is considered
	 * untrusted.
	 * @constructor
	 * @name Promise
	 */
	function Promise(then) {
		this.then = then;
	}

	Promise.prototype = {
		/**
		 * Register a callback that will be called when a promise is
		 * fulfilled or rejected.  Optionally also register a progress handler.
		 * Shortcut for .then(onFulfilledOrRejected, onFulfilledOrRejected, onProgress)
		 * @param {function?} [onFulfilledOrRejected]
		 * @param {function?} [onProgress]
		 * @return {Promise}
		 */
		always: function(onFulfilledOrRejected, onProgress) {
			return this.then(onFulfilledOrRejected, onFulfilledOrRejected, onProgress);
		},

		/**
		 * Register a rejection handler.  Shortcut for .then(undefined, onRejected)
		 * @param {function?} onRejected
		 * @return {Promise}
		 */
		otherwise: function(onRejected) {
			return this.then(undef, onRejected);
		},

		/**
		 * Shortcut for .then(function() { return value; })
		 * @param  {*} value
		 * @return {Promise} a promise that:
		 *  - is fulfilled if value is not a promise, or
		 *  - if value is a promise, will fulfill with its value, or reject
		 *    with its reason.
		 */
		yield: function(value) {
			return this.then(function() {
				return value;
			});
		},

		/**
		 * Assumes that this promise will fulfill with an array, and arranges
		 * for the onFulfilled to be called with the array as its argument list
		 * i.e. onFulfilled.spread(undefined, array).
		 * @param {function} onFulfilled function to receive spread arguments
		 * @return {Promise}
		 */
		spread: function(onFulfilled) {
			return this.then(function(array) {
				// array may contain promises, so resolve its contents.
				return all(array, function(array) {
					return onFulfilled.apply(undef, array);
				});
			});
		}
	};

	/**
	 * Create an already-resolved promise for the supplied value
	 * @private
	 *
	 * @param {*} value
	 * @return {Promise} fulfilled promise
	 */
	function fulfilled(value) {
		var p = new Promise(function(onFulfilled) {
			// TODO: Promises/A+ check typeof onFulfilled
			try {
				return resolve(onFulfilled ? onFulfilled(value) : value);
			} catch(e) {
				return rejected(e);
			}
		});

		return p;
	}

	/**
	 * Create an already-rejected {@link Promise} with the supplied
	 * rejection reason.
	 * @private
	 *
	 * @param {*} reason
	 * @return {Promise} rejected promise
	 */
	function rejected(reason) {
		var p = new Promise(function(_, onRejected) {
			// TODO: Promises/A+ check typeof onRejected
			try {
				return onRejected ? resolve(onRejected(reason)) : rejected(reason);
			} catch(e) {
				return rejected(e);
			}
		});

		return p;
	}

	/**
	 * Creates a new, Deferred with fully isolated resolver and promise parts,
	 * either or both of which may be given out safely to consumers.
	 * The Deferred itself has the full API: resolve, reject, progress, and
	 * then. The resolver has resolve, reject, and progress.  The promise
	 * only has then.
	 *
	 * @return {Deferred}
	 */
	function defer() {
		var deferred, promise, handlers, progressHandlers,
			_then, _progress, _resolve;

		/**
		 * The promise for the new deferred
		 * @type {Promise}
		 */
		promise = new Promise(then);

		/**
		 * The full Deferred object, with {@link Promise} and {@link Resolver} parts
		 * @class Deferred
		 * @name Deferred
		 */
		deferred = {
			then:     then, // DEPRECATED: use deferred.promise.then
			resolve:  promiseResolve,
			reject:   promiseReject,
			// TODO: Consider renaming progress() to notify()
			progress: promiseProgress,

			promise:  promise,

			resolver: {
				resolve:  promiseResolve,
				reject:   promiseReject,
				progress: promiseProgress
			}
		};

		handlers = [];
		progressHandlers = [];

		/**
		 * Pre-resolution then() that adds the supplied callback, errback, and progback
		 * functions to the registered listeners
		 * @private
		 *
		 * @param {function?} [onFulfilled] resolution handler
		 * @param {function?} [onRejected] rejection handler
		 * @param {function?} [onProgress] progress handler
		 */
		_then = function(onFulfilled, onRejected, onProgress) {
			// TODO: Promises/A+ check typeof onFulfilled, onRejected, onProgress
			var deferred, progressHandler;

			deferred = defer();

			progressHandler = typeof onProgress === 'function'
				? function(update) {
					try {
						// Allow progress handler to transform progress event
						deferred.progress(onProgress(update));
					} catch(e) {
						// Use caught value as progress
						deferred.progress(e);
					}
				}
				: function(update) { deferred.progress(update); };

			handlers.push(function(promise) {
				promise.then(onFulfilled, onRejected)
					.then(deferred.resolve, deferred.reject, progressHandler);
			});

			progressHandlers.push(progressHandler);

			return deferred.promise;
		};

		/**
		 * Issue a progress event, notifying all progress listeners
		 * @private
		 * @param {*} update progress event payload to pass to all listeners
		 */
		_progress = function(update) {
			processQueue(progressHandlers, update);
			return update;
		};

		/**
		 * Transition from pre-resolution state to post-resolution state, notifying
		 * all listeners of the resolution or rejection
		 * @private
		 * @param {*} value the value of this deferred
		 */
		_resolve = function(value) {
			value = resolve(value);

			// Replace _then with one that directly notifies with the result.
			_then = value.then;
			// Replace _resolve so that this Deferred can only be resolved once
			_resolve = resolve;
			// Make _progress a noop, to disallow progress for the resolved promise.
			_progress = noop;

			// Notify handlers
			processQueue(handlers, value);

			// Free progressHandlers array since we'll never issue progress events
			progressHandlers = handlers = undef;

			return value;
		};

		return deferred;

		/**
		 * Wrapper to allow _then to be replaced safely
		 * @param {function?} [onFulfilled] resolution handler
		 * @param {function?} [onRejected] rejection handler
		 * @param {function?} [onProgress] progress handler
		 * @return {Promise} new promise
		 */
		function then(onFulfilled, onRejected, onProgress) {
			// TODO: Promises/A+ check typeof onFulfilled, onRejected, onProgress
			return _then(onFulfilled, onRejected, onProgress);
		}

		/**
		 * Wrapper to allow _resolve to be replaced
		 */
		function promiseResolve(val) {
			return _resolve(val);
		}

		/**
		 * Wrapper to allow _reject to be replaced
		 */
		function promiseReject(err) {
			return _resolve(rejected(err));
		}

		/**
		 * Wrapper to allow _progress to be replaced
		 */
		function promiseProgress(update) {
			return _progress(update);
		}
	}

	/**
	 * Determines if promiseOrValue is a promise or not.  Uses the feature
	 * test from http://wiki.commonjs.org/wiki/Promises/A to determine if
	 * promiseOrValue is a promise.
	 *
	 * @param {*} promiseOrValue anything
	 * @returns {boolean} true if promiseOrValue is a {@link Promise}
	 */
	function isPromise(promiseOrValue) {
		return promiseOrValue && typeof promiseOrValue.then === 'function';
	}

	/**
	 * Initiates a competitive race, returning a promise that will resolve when
	 * howMany of the supplied promisesOrValues have resolved, or will reject when
	 * it becomes impossible for howMany to resolve, for example, when
	 * (promisesOrValues.length - howMany) + 1 input promises reject.
	 *
	 * @param {Array} promisesOrValues array of anything, may contain a mix
	 *      of promises and values
	 * @param howMany {number} number of promisesOrValues to resolve
	 * @param {function?} [onFulfilled] resolution handler
	 * @param {function?} [onRejected] rejection handler
	 * @param {function?} [onProgress] progress handler
	 * @returns {Promise} promise that will resolve to an array of howMany values that
	 * resolved first, or will reject with an array of (promisesOrValues.length - howMany) + 1
	 * rejection reasons.
	 */
	function some(promisesOrValues, howMany, onFulfilled, onRejected, onProgress) {

		checkCallbacks(2, arguments);

		return when(promisesOrValues, function(promisesOrValues) {

			var toResolve, toReject, values, reasons, deferred, fulfillOne, rejectOne, progress, len, i;

			len = promisesOrValues.length >>> 0;

			toResolve = Math.max(0, Math.min(howMany, len));
			values = [];

			toReject = (len - toResolve) + 1;
			reasons = [];

			deferred = defer();

			// No items in the input, resolve immediately
			if (!toResolve) {
				deferred.resolve(values);

			} else {
				progress = deferred.progress;

				rejectOne = function(reason) {
					reasons.push(reason);
					if(!--toReject) {
						fulfillOne = rejectOne = noop;
						deferred.reject(reasons);
					}
				};

				fulfillOne = function(val) {
					// This orders the values based on promise resolution order
					// Another strategy would be to use the original position of
					// the corresponding promise.
					values.push(val);

					if (!--toResolve) {
						fulfillOne = rejectOne = noop;
						deferred.resolve(values);
					}
				};

				for(i = 0; i < len; ++i) {
					if(i in promisesOrValues) {
						when(promisesOrValues[i], fulfiller, rejecter, progress);
					}
				}
			}

			return deferred.then(onFulfilled, onRejected, onProgress);

			function rejecter(reason) {
				rejectOne(reason);
			}

			function fulfiller(val) {
				fulfillOne(val);
			}

		});
	}

	/**
	 * Initiates a competitive race, returning a promise that will resolve when
	 * any one of the supplied promisesOrValues has resolved or will reject when
	 * *all* promisesOrValues have rejected.
	 *
	 * @param {Array|Promise} promisesOrValues array of anything, may contain a mix
	 *      of {@link Promise}s and values
	 * @param {function?} [onFulfilled] resolution handler
	 * @param {function?} [onRejected] rejection handler
	 * @param {function?} [onProgress] progress handler
	 * @returns {Promise} promise that will resolve to the value that resolved first, or
	 * will reject with an array of all rejected inputs.
	 */
	function any(promisesOrValues, onFulfilled, onRejected, onProgress) {

		function unwrapSingleResult(val) {
			return onFulfilled ? onFulfilled(val[0]) : val[0];
		}

		return some(promisesOrValues, 1, unwrapSingleResult, onRejected, onProgress);
	}

	/**
	 * Return a promise that will resolve only once all the supplied promisesOrValues
	 * have resolved. The resolution value of the returned promise will be an array
	 * containing the resolution values of each of the promisesOrValues.
	 * @memberOf when
	 *
	 * @param {Array|Promise} promisesOrValues array of anything, may contain a mix
	 *      of {@link Promise}s and values
	 * @param {function?} [onFulfilled] resolution handler
	 * @param {function?} [onRejected] rejection handler
	 * @param {function?} [onProgress] progress handler
	 * @returns {Promise}
	 */
	function all(promisesOrValues, onFulfilled, onRejected, onProgress) {
		checkCallbacks(1, arguments);
		return map(promisesOrValues, identity).then(onFulfilled, onRejected, onProgress);
	}

	/**
	 * Joins multiple promises into a single returned promise.
	 * @return {Promise} a promise that will fulfill when *all* the input promises
	 * have fulfilled, or will reject when *any one* of the input promises rejects.
	 */
	function join(/* ...promises */) {
		return map(arguments, identity);
	}

	/**
	 * Traditional map function, similar to `Array.prototype.map()`, but allows
	 * input to contain {@link Promise}s and/or values, and mapFunc may return
	 * either a value or a {@link Promise}
	 *
	 * @param {Array|Promise} promise array of anything, may contain a mix
	 *      of {@link Promise}s and values
	 * @param {function} mapFunc mapping function mapFunc(value) which may return
	 *      either a {@link Promise} or value
	 * @returns {Promise} a {@link Promise} that will resolve to an array containing
	 *      the mapped output values.
	 */
	function map(promise, mapFunc) {
		return when(promise, function(array) {
			var results, len, toResolve, resolve, i, d;

			// Since we know the resulting length, we can preallocate the results
			// array to avoid array expansions.
			toResolve = len = array.length >>> 0;
			results = [];
			d = defer();

			if(!toResolve) {
				d.resolve(results);
			} else {

				resolve = function resolveOne(item, i) {
					when(item, mapFunc).then(function(mapped) {
						results[i] = mapped;

						if(!--toResolve) {
							d.resolve(results);
						}
					}, d.reject);
				};

				// Since mapFunc may be async, get all invocations of it into flight
				for(i = 0; i < len; i++) {
					if(i in array) {
						resolve(array[i], i);
					} else {
						--toResolve;
					}
				}

			}

			return d.promise;

		});
	}

	/**
	 * Traditional reduce function, similar to `Array.prototype.reduce()`, but
	 * input may contain promises and/or values, and reduceFunc
	 * may return either a value or a promise, *and* initialValue may
	 * be a promise for the starting value.
	 *
	 * @param {Array|Promise} promise array or promise for an array of anything,
	 *      may contain a mix of promises and values.
	 * @param {function} reduceFunc reduce function reduce(currentValue, nextValue, index, total),
	 *      where total is the total number of items being reduced, and will be the same
	 *      in each call to reduceFunc.
	 * @returns {Promise} that will resolve to the final reduced value
	 */
	function reduce(promise, reduceFunc /*, initialValue */) {
		var args = slice.call(arguments, 1);

		return when(promise, function(array) {
			var total;

			total = array.length;

			// Wrap the supplied reduceFunc with one that handles promises and then
			// delegates to the supplied.
			args[0] = function (current, val, i) {
				return when(current, function (c) {
					return when(val, function (value) {
						return reduceFunc(c, value, i, total);
					});
				});
			};

			return reduceArray.apply(array, args);
		});
	}

	/**
	 * Ensure that resolution of promiseOrValue will trigger resolver with the
	 * value or reason of promiseOrValue, or instead with resolveValue if it is provided.
	 *
	 * @param promiseOrValue
	 * @param {Object} resolver
	 * @param {function} resolver.resolve
	 * @param {function} resolver.reject
	 * @param {*} [resolveValue]
	 * @returns {Promise}
	 */
	function chain(promiseOrValue, resolver, resolveValue) {
		var useResolveValue = arguments.length > 2;

		return when(promiseOrValue,
			function(val) {
				val = useResolveValue ? resolveValue : val;
				resolver.resolve(val);
				return val;
			},
			function(reason) {
				resolver.reject(reason);
				return rejected(reason);
			},
			resolver.progress
		);
	}

	//
	// Utility functions
	//

	/**
	 * Apply all functions in queue to value
	 * @param {Array} queue array of functions to execute
	 * @param {*} value argument passed to each function
	 */
	function processQueue(queue, value) {
		var handler, i = 0;

		while (handler = queue[i++]) {
			handler(value);
		}
	}

	/**
	 * Helper that checks arrayOfCallbacks to ensure that each element is either
	 * a function, or null or undefined.
	 * @private
	 * @param {number} start index at which to start checking items in arrayOfCallbacks
	 * @param {Array} arrayOfCallbacks array to check
	 * @throws {Error} if any element of arrayOfCallbacks is something other than
	 * a functions, null, or undefined.
	 */
	function checkCallbacks(start, arrayOfCallbacks) {
		// TODO: Promises/A+ update type checking and docs
		var arg, i = arrayOfCallbacks.length;

		while(i > start) {
			arg = arrayOfCallbacks[--i];

			if (arg != null && typeof arg != 'function') {
				throw new Error('arg '+i+' must be a function');
			}
		}
	}

	/**
	 * No-Op function used in method replacement
	 * @private
	 */
	function noop() {}

	slice = [].slice;

	// ES5 reduce implementation if native not available
	// See: http://es5.github.com/#x15.4.4.21 as there are many
	// specifics and edge cases.
	reduceArray = [].reduce ||
		function(reduceFunc /*, initialValue */) {
			/*jshint maxcomplexity: 7*/

			// ES5 dictates that reduce.length === 1

			// This implementation deviates from ES5 spec in the following ways:
			// 1. It does not check if reduceFunc is a Callable

			var arr, args, reduced, len, i;

			i = 0;
			// This generates a jshint warning, despite being valid
			// "Missing 'new' prefix when invoking a constructor."
			// See https://github.com/jshint/jshint/issues/392
			arr = Object(this);
			len = arr.length >>> 0;
			args = arguments;

			// If no initialValue, use first item of array (we know length !== 0 here)
			// and adjust i to start at second item
			if(args.length <= 1) {
				// Skip to the first real element in the array
				for(;;) {
					if(i in arr) {
						reduced = arr[i++];
						break;
					}

					// If we reached the end of the array without finding any real
					// elements, it's a TypeError
					if(++i >= len) {
						throw new TypeError();
					}
				}
			} else {
				// If initialValue provided, use it
				reduced = args[1];
			}

			// Do the actual reduce
			for(;i < len; ++i) {
				// Skip holes
				if(i in arr) {
					reduced = reduceFunc(reduced, arr[i], i, arr);
				}
			}

			return reduced;
		};

	function identity(x) {
		return x;
	}

	return when;
});
})(function(factory) {
  SG.when = factory();
});


(function( window, sg ) {

var document = window.document,
  expando = sg.expando,
  utils = sg.utils,
  str__setInterval = "setInterval",
  rWhiteSpaces = /\s+/;
  

// Event object part
// jQuery port
var str__tachEvent = 'tachEvent',
  str__attachEvent = 'at' + str__tachEvent,
  str__detachEvent = 'de' + str__tachEvent,
  str__EventListener = 'EventListener',
  str__addEventListener = 'add' + str__EventListener,
  str__removeEventListener = 'remove' + str__EventListener,
  str__preventDefault = 'preventDefault',
  str__isDefaultPrevented = 'isDefaultPrevented',
  str__stopPropagation = 'stopPropagation',
  str__isPropagationStopped = 'isPropagationStopped',
  str__stopImmediatePropagation = 'stopImmediatePropagation',
  str__isImmediatePropagationStopped = 'isImmediatePropagationStopped',
  eventMigrationProps = ( "altKey attrChange attrName bubbles button cancelable charCode " +
    "clientX clientY ctrlKey currentTarget data detail eventPhase fromElement handler " +
    "keyCode layerX layerY metaKey newValue offsetX offsetY pageX pageY prevValue " +
    "relatedNode relatedTarget screenX screenY shiftKey srcElement target toElement " +
    "view wheelDelta which" ).split(" "),
  addEvent = document[ str__addEventListener ] ? function( elem, event, fn ) {
      elem[ str__addEventListener ]( event, fn, false );
    } : document[ str__attachEvent ] ? function( elem, event, fn ) {
      elem[ str__attachEvent ]( "on" + event, fn );
    } : emptyFn,
  removeEvent = document[ str__addEventListener ] ? function( elem, event, fn ) {
      elem[ str__removeEventListener ]( event, fn, false );
    } : document[ str__attachEvent ] ? function( elem, event, fn ) {
      elem[ str__detachEvent ]( "on" + event, fn );
    } : emptyFn,
  oneEvent = function( elem, event, fn ) {
    addEvent( elem, event, function() {
      removeEvent( elem, event, arguments.callee );
      return fn.apply( elem, arguments );
    });
  },
  isDefaultPrevented = function( event ) {
    return (
      "defaultPrevented" in event
        ? event.defaultPrevented
        : "returnValue" in event
          ? !event.returnValue
          : "getPreventDefault" in event
            ? event.getPreventDefault()
            : false
    );
  },
  fnTRUE = function() {
    return true;
  },
  fnFALSE = function() {
    return false;
  };

  
var Event = {
    fired: null,
    c: {},
    custom: {},
    hlink: function( source, someFn ) {
      someFn[ expando ] = source[ expando ] = source[ expando ] || sg.guid();
      return someFn;
    },
    fix: function( event ) {
      if ( event[ expando ] ) {
        return event;
      }
      
      // Клонируем объект события
        var originalEvent = event;
        event = new Event.Event( event );
        
        // Клонируем свойства из оригинального объекта
        for ( var i = 0, prop; ( prop = eventMigrationProps[ i++ ] ); ) {
        event[ prop ] = originalEvent[ prop ];
      }
  
      // Fix target property, if necessary
      if ( !event.target ) {
        // Fixes #1925 where srcElement might not be defined either
        event.target = event.srcElement || document;
      }
  
      // check if target is a textnode (safari)
      if ( event.target.nodeType === 3 ) {
        event.target = event.target.parentNode;
      }
  
      // Add relatedTarget, if necessary
      if ( !event.relatedTarget && event.fromElement ) {
        event.relatedTarget = event.fromElement === event.target ? event.toElement : event.fromElement;
      }
  
      // Calculate pageX/Y if missing and clientX/Y available
      if ( event.pageX == null && event.clientX != null ) {
        var eventDocument = event.target.ownerDocument || document,
          doc = eventDocument.documentElement,
          body = eventDocument.body;
  
        event.pageX = event.clientX + (doc && doc.scrollLeft || body && body.scrollLeft || 0) - (doc && doc.clientLeft || body && body.clientLeft || 0);
        event.pageY = event.clientY + (doc && doc.scrollTop  || body && body.scrollTop  || 0) - (doc && doc.clientTop  || body && body.clientTop  || 0);
      }
  
      // Add which for key events
      if ( event.which == null && (event.charCode != null || event.keyCode != null) ) {
        event.which = event.charCode != null ? event.charCode : event.keyCode;
      }
  
      // Add metaKey to non-Mac browsers (use ctrl for PC's and Meta for Macs)
      if ( !event.metaKey && event.ctrlKey ) {
        event.metaKey = event.ctrlKey;
      }
  
      // Add which for click: 1 === left; 2 === middle; 3 === right
      // Note: button is not normalized, so don't use it
      if ( !event.which && event.button !== undefined ) {
        event.which = (event.button & 1 ? 1 : ( event.button & 2 ? 3 : ( event.button & 4 ? 2 : 0 ) ));
      }
        
      return event;
    },
    handler: function( event, data ) {
      event = Event.fix( event || window.event );
        
      event.currentTarget = this;
      
      var handlers = Event.c[ this[ expando ] ][ event.type ],
        handler,
        data = data && utils.isArr( data ) ? utils.mkarr( data ) : null;
      
      if( data ) {
        data.unshift( event );
      }
        
      for( var i = 0, l = handlers.length, ret; i < l; i++ ) {
        handler = handlers[ i ];
        ret = data
          ? handler.apply( this, data )
          : handler.call( this, event );
        if( ret === false ) {
          event[ str__preventDefault ]();
          event[ str__stopPropagation ]();
        }
        if( event[ str__isImmediatePropagationStopped ]() ) {
          break;
        }
      }
    },
    add: function ( elem, event, handler, /* internal use only */ firstHandler ) {
      if( elem && event ) {
        if( elem[ str__setInterval ] && elem != window && !elem.frameElement ) {
          elem = window;
        }
        
        var handlers = utils.from( handler ),
            appendMethod = firstHandler ? "unshift" : "push";
        utils.arrEach( event.split( rWhiteSpaces ), function( eventType ) {
          if( !eventType ) {
            return;
          }

          utils.arrEach( handlers, function( handler ) {
            if( !handler || !utils.isFn( handler ) ) {
              return;
            }

            if( !handler[ expando ] ) {
              handler[ expando ] = sg.guid();
            }
            
            var elemGuid = elem[ expando ] = elem[ expando ] || sg.guid(),
              listeners = Event.c[ elemGuid ] = Event.c[ elemGuid ] || {},
              eventListeners = listeners[ eventType ] = listeners[ eventType ] || [],
              eventHandle = eventListeners.handle = function( event, data ) {
                if( !event || event.type !== Event.fired ) {
                  return Event.handler.call( eventHandle.elem, event, data );
                }
              };
            
            eventHandle.elem = elem;
           
            if( eventListeners[ appendMethod ]( handler ) == 1 && ( elem.nodeType || elem[ str__setInterval ] ) ) {
              var custom = Event.custom && Event.custom[ eventType ] && Event.custom[ eventType ].setup;
              if( !custom || custom.call( elem, eventHandle ) === false ) {
                addEvent( elem, eventType, eventListeners.handle );
              }
            }
          });
        });
      }
    },
    one: function( elem, event, handler ) {
      Event.add(
        elem,
        event,
        Event.hlink( handler, function() {
          Event.rm( this, event, arguments.callee );
          return handler.apply( this, arguments );
        })
      );
    },
    first: function( elem, event, handler) {
      Event.add( elem, event, handler, true );
    },
    rm: function ( elem, event, handler ) {
      if( !elem ) {
        return;
      }
      
      if( !event ) {
        var elemGuid = elem[ expando ],
          listeners = elemGuid && Event.c[ elemGuid ],
          eventTypes = [],
          eventType;
        if( listeners ) {
          for( eventType in listeners ) {
            if( utils.hasOwn( listeners, eventType ) ) {
              eventTypes.push( eventType );
            }
          }
          Event.rm( elem, eventTypes.join(" ") );
        }
        
      } else {
      
        if( elem[ str__setInterval ] && elem != window && !elem.frameElement ) {
          elem = window;
        }
        utils.arrEach( event.split( rWhiteSpaces ), function( eventType ) {
          if( !eventType ) {
            return;
          }

          var elemGuid = elem[ expando ],
            listeners = elemGuid && Event.c[ elemGuid ],
            eventListeners = listeners && listeners[ eventType ];
            
          if( elemGuid && listeners && eventListeners ) {
            if( utils.isFn( handler ) && handler[ expando ] ) {
              for( var l = eventListeners.length; l--; ) {
                if( eventListeners[ l ][ expando ] == handler[ expando ] ) {
                  eventListeners.splice( l, 1 );
                  break;
                }
              }
            } else {
              eventListeners.length = 0;
            }
            
            if( !eventListeners.length ) {
              if( elem.nodeType || elem[ str__setInterval ] ) {
                var custom = Event.custom && Event.custom[ eventType ] && Event.custom[ eventType ].teardown;
                if( !custom || custom.call( elem, eventListeners.handle ) === false ) {
                  removeEvent( elem, eventType, eventListeners.handle );
                }
              }
              
              delete listeners[ eventType ];
              
              for( eventType in listeners ) {
                return;
              }
              
              delete Event.c[ elemGuid ];
            }
          }
        });
      }
    },
    fire: function( elem, event, data ) {
      if( !elem || !event ) {
        return;
      }
      
      data = utils.from( data );
      
      var eventType = event.type || event,
        eventObj,
        onEventType = 'on' + eventType,
        elemGuid = elem[ expando ],
        listeners = elemGuid && Event.c[ elemGuid ],
        eventListeners = listeners && listeners[ eventType ];
      
      if( eventListeners ) {
        
        if( !event[ expando ] ) {
          if( typeof event === "object" ) {
            eventObj = new Event.Event( eventType, event );
          } else {
            eventObj = new Event.Event( event );
          }
        } else {
          eventObj = event;
        }
        
        eventObj.type = eventType;
        eventObj.target = eventObj.currentTarget = elem;
        
        eventListeners.handle.call( elem, eventObj, data );
      }
      
      
      if( !eventObj || !eventObj[ str__isDefaultPrevented ]() ) {
        var oldOnEventType;
        try {
          if( ( elem.nodeType || elem[ str__setInterval ] ) && onEventType && elem[ eventType ] ) {
            oldOnEventType = elem[ onEventType ];
  
            if( oldOnEventType ) {
              elem[ onEventType ] = null;
            }
                        
            Event.fired = eventType;
            elem[ eventType ]();
          }
        } catch ( ieError ) {}
  
        if ( oldOnEventType ) {
          elem[ onEventType ] = oldOnEventType;
        }
      }
      
      Event.fired = null;
    },
    copy: function( elemFrom, elemTo, event ) {
      var eventObj,
        elemGuid = elemFrom[ expando ],
        listeners = elemGuid && Event.c[ elemGuid ],
        eventListeners = null;
      if( event != null && listeners && listeners[ event ] ) {
        eventListeners = {};
        eventListeners[ event ] = listeners[ event ];
      } else if( listeners ) {
        eventListeners = listeners;
      }
      utils.objEach( eventListeners, function( handlers, eventType ) {
        Event.add( elemTo, eventType, handlers );
      });
    }
  };

Event.Event = function( event, props ) {
  var self = this;
  
  // Event object
  if( event && event.type ) {
    self.origEvent = event;
    self.type = event.type;
    
    self[ str__isDefaultPrevented ] = isDefaultPrevented( event ) ? fnTRUE : fnFALSE;

  // Event type
  } else {
    self.type = event;
  }

  // Put explicitly provided properties onto the event object
  if ( props ) {
    extend( self, props );
  }

  // timeStamp is buggy for some events on Firefox(#3843)
  // So we won't rely on the native value
  self.timeStamp = sg.now();

  // Mark it as fixed
  self[ expando ] = true;
};

var EventProto = Event.Event.prototype;
EventProto[ str__preventDefault ] = function() {
  this[ str__isDefaultPrevented ] = fnTRUE;
       

  var e = this.origEvent;
  if ( !e ) {
    return;
  }

  // if preventDefault exists run it on the original event
  if ( e[ str__preventDefault ] ) {
    e[ str__preventDefault ]();

  // otherwise set the returnValue property of the original event to false (IE)
  } else {
    e.returnValue = false;
  }
};
EventProto[ str__stopPropagation ] = function() {
  this[ str__isPropagationStopped ] = fnTRUE;

  var e = this.origEvent;
  if ( !e ) {
    return;
  }
  
  // if stopPropagation exists run it on the original event
  if ( e[ str__stopPropagation ] ) {
    e[ str__stopPropagation ]();
  }
  // otherwise set the cancelBubble property of the original event to true (IE)
  e.cancelBubble = true;
};
EventProto[ str__stopImmediatePropagation ] = function() {
  this[ str__isImmediatePropagationStopped ] = fnTRUE;
  this[ str__stopPropagation ]();
};
EventProto[ str__isDefaultPrevented ] = fnFALSE;
EventProto[ str__isPropagationStopped ] = fnFALSE;
EventProto[ str__isImmediatePropagationStopped ] = fnFALSE;


var mouselenterFixObject = {
  mouseover: "mouseenter",
  mouseout: "mouseleave"
};
// Checks if an event happened on an element within another element
// Used in jQuery.event.special.mouseenter and mouseleave handlers
function mouseenterFix( event ) {
  // Check if mouse(over|out) are still within the same parent element
  var related = event.relatedTarget,
    inside = false,
    eventType = event.type;

  event.type = mouselenterFixObject[ eventType ];

  if( related !== this ) {
    if( related ) {
      inside = utils.contains( this, related );
    }

    if( !inside ) {
      var args = utils.mkarr( arguments );
      Event.fire( this, args.shift(), args );
      event.type = eventType;
    }
  }
}

utils.objEach( mouselenterFixObject, function( orig, fix ) {
  Event.custom[ orig ] = {
    setup: function() {
      Event.add( this, fix, mouseenterFix );
    },
    teardown: function() {
      Event.rm( this, fix, mouseenterFix );
    }
  };
});


// for inheritance objects
Event.protoMixin = {
  on: function( event, cb ) {
    Event.add( this, event, cb );
  },
  off: function( event, cb ) {
    Event.rm( this, event, cb );
  },
  fire: function( event, data ) {
    Event.fire( this, event, data );
  }
};


// share
Event.natAdd = addEvent;
Event.natRm = removeEvent;
Event.natOne = oneEvent;
Event.natIsDefaultPrevented = isDefaultPrevented;
sg.Event = Event;
utils.Event = Event; // deprecated

})( window, SG );


(function( window, sg, undefined ) {

var
  document = window.document,
  location = window.location,
  utils = sg.utils,
  extend = utils.ext,
  isFn = utils.isFn,
  bind = utils.bind,
  Event = sg.Event,
  when = sg.when,
  rhashrm = /#.*$/,

  // from jQuery
  rurl = /^([\w\+\.\-]+:)(?:\/\/([^\/?#:]*)(?::(\d+))?)?/,
  rlocalProtocol = /^(?:about|app|app\-storage|.+\-extension|file|res|widget):$/,
  rheaders = /^(.*?):[ \t]*([^\r\n]*)\r?$/mg,
  ajaxLocation,
  ajaxLocParts,

  reqId = 1;

try {
  ajaxLocation = location.href;
} catch( e ) {
  ajaxLocation = document.createElement( "a" );
  ajaxLocation.href = "";
  ajaxLocation = ajaxLocation.href;
}

// Segment location into parts
ajaxLocParts = rurl.exec( ajaxLocation.toLowerCase() ) || [];


function getSimpleXHR() {
  try {
    return new XMLHttpRequest();
  } catch(e) {}
  try {
    return new ActiveXObject("Microsoft.XMLHTTP");
  } catch(e) {}
  return null;
}

var xhr = getSimpleXHR(),
  supportCORS = "withCredentials" in xhr;
xhr = null;


function getProxyMethod( name ) {
  return function() {
    var
      self = this,
      ret,
      module = self._transport,
      module_method = module[ name ];

    if( arguments.length ) {
      ret = module_method.apply( module, arguments );
    } else {
      ret = module_method.call( module );
    }
    return ret;
  };
}


function Ajax( url, options ) {
  if( !( this instanceof Ajax ) ) {
    return new Ajax( url, options );
  }

  this._init( url, options );
}

Ajax.prototype = {
  // private
  _state: 0,

  // public props
  readyState: 0,
  status: -1,
  statusText: "",
  responseText: null,
  responseXML: null,
  startTime: 0,
  endTime: 0,
  elapsedTime: 0,

  _init: function( url, options ) {
    var
      self = this,
      urlParts;

    url = url.replace( rhashrm , "" );
    options = extend( true, {}, Ajax.defaults, options );
    options.method = options.method.toUpperCase();
    
    // port from jQuery
    if( options.crossDomain == null ) {
      urlParts = rurl.exec( url.toLowerCase() );
      options.crossDomain = !!( urlParts &&
        ( urlParts[ 1 ] != ajaxLocParts[ 1 ] || urlParts[ 2 ] != ajaxLocParts[ 2 ] ||
          ( urlParts[ 3 ] || ( urlParts[ 1 ] === "http:" ? 80 : 443 ) ) !=
            ( ajaxLocParts[ 3 ] || ( ajaxLocParts[ 1 ] === "http:" ? 80 : 443 ) ) )
      );
    }
    
    if( !options.dataType ) {
      throw Error("dataType must be specified");  
    }
    options.dataType = options.dataType.toLowerCase();

    self.url = url;
    self.options = options;

    // init callbacks bindings from options
    var cb_names = ["success", "complete", "error"];
    utils.arrEach( cb_names, function( cb_name ) {
      var cb = options[ cb_name ];
      if( cb && isFn( cb ) ) {
        self.on( cb_name, cb );
      }
    });
   
    // deffered object for transport module
    var defer = when.defer(),
        promise = defer.promise;
    promise.always( bind( self._pAlwaysBefore, self ) );
    promise.then(
      bind( self._pResolve, self ),
      bind( self._pReject, self )
    );
    promise.always( bind( self._pAlwaysAfter, self ) );
    self._defer = defer;

    // initialize transport module via dataType
    var transportModule;
    if( options.dataType === "jsonp" ) {
      transportModule = transports.JSONP;
    } else {
      transportModule = transports.XHR; 
    }
    self._transport = new transportModule( self );
  },
  _dataTypes: {
    json: utils.parseJSON,
    xml: utils.parseXML
  },
  _handleResponse: function( response ) {
    var
      self = this,
      options = self.options,
      dataType = options.dataType,
      data,
      convertor;

    if( response == null ) {
      return;
    }

    convertor = self._dataTypes[ dataType ];
    if( !convertor ) {
      data = String( response );
    } else {
      data = convertor( response );
    }
    return data;
  },
  _pAlwaysBefore: function( data ) {
    var
      self = this,
      status = data[ 0 ],
      statusText = data[ 1 ];

    // set timings
    self.endTime = sg.now();
    self.elapsedTime = self.endTime - self.startTime;
    
    // state and statuses
    self._state = 2;
    self.status = status;
    self.statusText = statusText;
    self.readyState = status > 0 && status < 600 ? 4 : 0;
  },
  _pAlwaysAfter: function( data ) {
    var
      self = this;

    self.fire( "complete", [ self.statusText ] );
    
    // remove all listeners
    self.off();
  },
  _pResolve: function( data ) {
    var
      self = this,
      options = self.options,
      responses = data[ 2 ],
      response;
    
    if( options.dataType !== "jsonp" ) {
      self.responseText = responses.text;
      self.responseXml = responses.xml;
      response = self._handleResponse( responses.text );
    } else {
      response = responses;
    }

    self.fire( "success", [ response, self.statusText ] );
  },
  _pReject: function( data ) {
    var
      self = this;
    
    self.fire( "error", [ self.statusText, data[ 2 ] ] );
  },

  // public methods
  send: function() {
    var
      self = this;
    
    // set starting time
    self.startTime = sg.now();

    // make request
    self._transport.send();

    if( self._state < 2 ) {
      self._state = 1;
      self.readyState = 1;
    }
  },
  abort: getProxyMethod( "abort" ),
  setRequestHeader: getProxyMethod( "setRequestHeader" ),
  getAllResponseHeaders: getProxyMethod( "getAllResponseHeaders" ),
  getResponseHeader: getProxyMethod( "getResponseHeader" )
};

// provide Event methods (on, off, fire)
extend( Ajax.prototype, Event.protoMixin );


// transports storage
var transports = {}
Ajax.transports = transports;


// Base class for transport modules
function BaseTransport( wrapper ) {
  var self = this;

  self._wrap = wrapper;
  self._url = wrapper.url;
  self._options = wrapper.options;
  self._defer = wrapper._defer;
}

BaseTransport.prototype = {
  send: function() {},
  abort: function() {},
  setRequestHeader: function( name, value ) {},
  getAllResponseHeaders: function() {return null;},
  getResponseHeader: function( name ) {return null;}
};

transports._Base = BaseTransport;


// XmlHttpRequest transport
function XHRTransport( wrapper ) {
  var self = this;
  BaseTransport.call( self, wrapper );

  self._xhr = null;
  self._processing = false;
  self._completed = false;
  self._aborted = false;
  self._tmid = null;
  self._reqHeaders = {};
  self._resHeadersStr = null;
  self._resHeaders = null;
}

XHRTransport.prototype = extend( {}, BaseTransport.prototype, {
  _getXHR: function() {
    return getSimpleXHR();
  },
  _onreadystatechange: function() {
    var
      self = this,
      options = self._options,
      defer = self._defer,
      xhr = self._xhr,
      isAborted = self._aborted,
      xhrStatus,
      xhrStatusText,
      xhrReadyState,
      xhrResponseXml,
      xhrResponseText,
      xhrAllResponseHeaders,
      statusText,
      responses = {};

    if( self._completed ) {
      return;
    }

    try {
      xhrReadyState = xhr.readyState;
    } catch( e ) {
      xhrReadyState = 0;
    }
    if( !isAborted && xhrReadyState === 4 ) {
      xhrStatus = xhr.status;
      
      try {
        xhrStatusText = xhr.statusText;
      } catch(e) {
        xhrStatusText = "";
      }
      
      var xml = xhr.responseXML;
      if ( xml && xml.documentElement ) {
        xhrResponseXml = xml;
      }
      try {
        xhrResponseText = xhr.responseText;
      } catch(e) {}

      xhrAllResponseHeaders = xhr.getAllResponseHeaders();
      self._resHeadersStr = xhrAllResponseHeaders;
    }

    if( isAborted || xhrReadyState === 4 ) {
      xhr.onreadystatechange = sg.noop;

      if( self._tmid ) {
        clearTimeout( self._tmid );
      }
      
      if( !isAborted ) {
        if( !xhrStatus && !options.crossDomain ) {
          xhrStatus = xhrResponseText ? 200 : 404;
        } else if( xhrStatus === 1223 ) {
          xhrStatus = 204;
        }
        
        statusText = STATUSES[ xhrStatus ] || xhrStatusText;
        
        if( xhrStatus >= 200 && xhrStatus < 300 || xhrStatus === 304 ) {
          if( xhrStatus !== 204 ) {
            if( xhrResponseText ) {
              responses.text = xhrResponseText;
            }
            if( xhrResponseXml ) {
              responses.xml = xhrResponseXml;
            }
          }

          defer.resolve( [ xhrStatus, statusText, responses ] );
        } else {
          defer.reject( [ xhrStatus, statusText, "" ] );
        }
        
        self._cleanup();
      }

      self._processing = false;
      self._completed = true;
    }
  },
  _abort: function( status ) {
    var self = this,
      xhr = self._xhr,
      statusText = STATUSES[ status ],
      defer = self._defer;
    
    self._aborted = true;
    xhr.abort();

    self._onreadystatechange();
    
    defer.reject( [ status, statusText, "" ] );

    self._cleanup();
  },
  _cleanup: function() {
    var self = this;
    self._xhr = null;
    self._tmid = null;
    self._reqHeaders = {};
  },
  
  send: function() {
    var
      self = this,
      options = self._options,
      defer = self._defer,
      xhr,
      method,
      url,
      urlQSStart,
      urlArgs = "",
      k;

    if( self._processing ) {
      throw Error("already processing");
    }
      
    xhr = self._getXHR();
    if( !xhr ) {
      throw Error("XHR not supported in your browser");
    }
    
    self._xhr = xhr;
    
    method = options.method;
    
    url = self._url;
    if( method === "POST" ) {
      urlQSStart = url.indexOf("?");
      if( ~urlQSStart ) {
        urlArgs = url.slice( urlQSStart + 1 );
        url = url.substring( 0, urlQSStart );
      }
    }
    
    // open socket
    xhr.open( method, url, !!options.async );
    
    // general callback
    xhr.onreadystatechange = bind( self._onreadystatechange, self );
    
    if( method === "POST" ) {
      self.setRequestHeader("Content-Type", options.contentType );
    }
    if( !options.cache ) {
      self.setRequestHeader("If-Modified-Since", "Sat, 1 Jan 1970 00:00:00 GMT");
    }
    
    var reqHeaders = self._reqHeaders;
    if ( !options.crossDomain && !reqHeaders["X-Requested-With"] ) {
      reqHeaders["X-Requested-With"] = "XMLHttpRequest";
    }

    try {
      for( k in reqHeaders ) {
        xhr.setRequestHeader( k, reqHeaders[ k ] );
      };
    } catch( e ) {}
    
    // set additionals xhr props
    var xhrFields = options.xhrFields;
    if ( xhrFields ) {
      for( k in xhrFields ) {
        try {
          xhr[ k ] = xhrFields[ k ];
        } catch( e ) {}
      }
    }
    
    // set timeout
    if( options.timeout ) {
      self._tmid = setTimeout(function() {
        self._abort( Ajax.TIMEOUT );
      }, options.timeout );
    }
    
    // mark as processing
    self._processing = true;
    
    // make request
    try {
      xhr.send( method === "POST" ? urlArgs : null );
    } catch( e ) {
      defer.reject( [ Ajax.SEND_ERROR, STATUSES[ Ajax.SEND_ERROR ], e ] );
    }
  },
  abort: function() {
    var self = this;
    if( !self._completed ) {
      self._abort( Ajax.CANCELED );
    }
  },
  setRequestHeader: function( name, value ) {
    var self = this;
    self._reqHeaders[ name ] = value;
  },
  getAllResponseHeaders: function() {
    var
      self = this,
      headersStr = self._resHeadersStr;
    return headersStr == null ? null : headersStr;
  },
  getResponseHeader: function( name ) {
    var
      self = this,
      match,
      nameLower = name.toLowerCase(),
      headers = self._resHeaders,
      headersStr = self._resHeadersStr;

    if( !headers ) {
      headers = self._resHeaders = {};
      while( ( match = rheaders.exec( headersStr ) ) ) {
        headers[ match[ 1 ].toLowerCase() ] = match[ 2 ];
      }
    }
    match = headers[ nameLower ];
    return match === undefined ? null : match;
  }
});

transports.XHR = XHRTransport;


// jsonp transport
function JSONPTransport( wrapper ) {
  var self = this;
  BaseTransport.call( self, wrapper );
  
  self._script = null;
  self._jsonpCallback = null;
  self._processing = false;
  self._completed = false;
  self._aborted = false;
  self._tmid = null;
}

JSONPTransport.prototype = extend( {}, BaseTransport.prototype, {
  _onload: function() {
    var self = this,
      node = self._script,
      aborted = self._aborted;
    if( aborted || !node.readyState || node.readyState === "loaded" )  {
      node.onload = node.onreadystatechange = null;
      
      utils.rme(node);
      node = null;
      self._script = null;
      
      self._complete();
      
      if( aborted ) {
        self._replGlCb2Rm();
      }
    }
  },
  _glCb: function( response ) {
    var
      self = this,
      defer = self._defer;

    self._complete();
    self._rmGlCb();

    defer.resolve( [ Ajax.OK, STATUSES[ Ajax.OK ], response ] );
    
    self._cleanup();
  },
  _complete: function() {
    var self = this;
    
    if( self._tmid ) {
      clearTimeout( self._tmid );
    }
    self._completed = true;
    self._processing = false;
  },
  _addGlCb: function() {
    var self = this;
    window[ self._jsonpCallback ] = bind( self._glCb, self );
  },
  _rmGlCb: function() {
    var cb_name = this._jsonpCallback;
    try {
      delete window[ cb_name ];
    } catch( e ) {
      window[ cb_name ] = undefined;
    }
  },
  _replGlCb2Rm: function() {
    var self = this;
    window[ self._jsonpCallback ] = bind( self._rmGlCb, self );
  },
  _abort: function( status ) {
    var
      self = this,
      defer = self._defer;
    self._aborted = true;
    self._onload();
 
    defer.reject( [ status, STATUSES[ status ], "" ] );

    self._cleanup();
  },
  _cleanup: function() {
    var self = this;
    // self._script = null;
    // do not clean, because global callback may execute
    // self._jsonpCallback = null;
    // self._processing = false;
    // self._completed = false;
    // self._aborted = false;
    self._tmid = null;
  },
  
  _getNodeToInsert: function() {
    return ( document.head
        || sg.$("head") || sg.$("body")
        || document.documentElement );
  },

  // public methods
  send: function() {
    var self = this;
    if( self._processing ) {
      throw Error("already processing");
    }
    
    var options = self._options,
      $head = self._getNodeToInsert(),
      jsonpParam = options.jsonp,
      jsonpCallback = options.jsonpCallback,
      charset = options.scriptCharset,
      $script,
      url,
      extraData = {};
      
    if( isFn( jsonpCallback ) ) {
      jsonpCallback = jsonpCallback();
    }
    
    if( options.data ) {
      extraData = extend( extraData, options.data );
    }
    extraData[ jsonpParam ] = jsonpCallback;
    
    if( !options.cache ) {
      extraData["_"] = sg.now();
    }
    
    url = self._url;
    // build url
    url = utils.aprm( url, extraData );
    
    $script = utils.cre("script");
    $script.async = true;
    if( charset ) {
      $script.charset = charset;
    }
    
    // set onload handler
    $script.onload = $script.onreadystatechange = bind( self._onload, self );

    $script.src = url;
    
    // add props
    self._script = $script;
    self._jsonpCallback = jsonpCallback;
    
    // add general handler
    self._addGlCb();
    
    if( options.timeout ) {
      self._tmid = setTimeout(function() {
        self._abort( Ajax.TIMEOUT );
      }, options.timeout);
    }
    
    self._processing = true;

    // insert script node to head for make request
    $head.insertBefore( $script, $head.firstChild );
  },
  abort: function() {
    var self = this;
    if( !self._completed ) {
      self._abort( Ajax.CANCELED );
    }
  }
});

transports.JSONP = JSONPTransport;


// statuses
var
  stid = 600,
  cds = {},
  STATUSES = {};
function addStatus( name, code, text ) {
  name = name.toUpperCase();
  Ajax[ name ] = code;
  STATUSES[ code ] = text;
}
addStatus("OK", 200, "success" );
addStatus("NO_CONTENT", 204, "No Content" );
addStatus("NOT_MODIFIED", 304, "notmodified" );
addStatus("CANCELED", stid++, "canceled" );
addStatus("TIMEOUT", stid++, "timeout" );
addStatus("SEND_ERROR", stid++, "send error" );
Ajax.STATUSES = STATUSES;


// default options
Ajax.defaults = {
  dataType: "text",
  method: "GET",
  async: true,
  contentType: "application/x-www-form-urlencoded; charset=utf-8",
  xhrFields: {
    withCredentials: false
  },
  jsonp: "callback",
  jsonpCallback: function() {
    return sg.expando + "_" + reqId++; 
  },
  scriptCharset: "utf-8"
};


// share
sg.Ajax = Ajax;

})( window, SG );


/**
 * Template Engine
 * based on Simple JavaScript Templating via John Resig - http://ejohn.org/
 */
(function( sg ) {

var utils = sg.utils,
  EXPANDO = sg.expando,
  getGUID = sg.guid;

var start = "<%",
  end = "%>",
  reCarretSpaces = /[\r\t\n]/g,
  reEnding = RegExp( "((^|" + utils.resc( end ) + ")[^\\t]*)'", "g" ),
  reVar = RegExp( "\\t=(.*?)" + utils.resc( end ), "g" ),
  errors = [],
  cache = {};

function tmpl( selector, data ) {
  var res,
    isString = typeof selector === "string",
    isSelector = false,
    isNode;
  
  if( isString ) {
    selector = utils.trim( selector );
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
      var elem = sg.$( selector );
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
                $1 = utils.trim( $1 );
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

// share
utils.tmpl = tmpl;
sg.tmpl = tmpl;

})( SG );

