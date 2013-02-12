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

