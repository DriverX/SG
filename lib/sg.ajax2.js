(function( window, sg ) {

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
  ajaxLocation,
  ajaxLocParts;

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
      module = self._module,
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
  // public props
  readyState: 0,
  status: -1,
  statusText: "",
  responseText: null,
  responseXML: null,
  elapsed_time: 0,

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

    self._url = url;
    self._options = options;

    // init callbacks bindings from options
    var cb_names = ["success", "complete", "error"];
    utils.arrEach( cb_names, function( cb_name ) {
      var cb = options[ cb_name ];
      if( cb && isFn( cb ) ) {
        self.on( cb_name, cb );
      }
    });
   
    // deffered object for transport module
    var defer = when.defer();
    self._defer = defer;
    defer.promise.then(
      bind( self._ifResolve, self ),
      bind( self._ifReject, self )
    );

    // initialize transport module via dataType
    var transportModule;
    if( options.dataType === "jsonp" ) {
      transportModule = Ajax.modules.JSONP;
    } else {
      transportModule = Ajax.modules.XHR; 
    }
    self._module = new transportModule( self );
  },
  
  _ifResolve: function( response ) {
    var
      self = this;

    // console.log( "resolve", response );
    self.fire( "success", [ response ] );
  },
  _ifReject: function( reason ) {
    var
      self = this;
    
    // console.log( "reject", reason );
    self.fire( "error", [ reason ] );
  },

  // public methods
  send: getProxyMethod( "send" ),
  abort: getProxyMethod( "abort" ),
  destroy: getProxyMethod( "destroy" ),
  setRequestHeader: getProxyMethod( "setRequestHeader" ),
  getAllResponseHeaders: getProxyMethod( "getAllResponseHeaders" ),
  getResponseHeader: getProxyMethod( "getResponseHeader" )
};

// provide Event methods (on, off, fire)
extend( Ajax.prototype, Event.protoMixin );


// transports storage
Ajax.modules = {};


// Base class for transport modules
Ajax.modules._Base = function( wrapper ) {
  var self = this;

  self._wrap = wrapper;
  self._url = wrapper._url;
  self._options = wrapper._options;
  self._defer = wrapper._defer;
};
Ajax.modules._Base.prototype = {
  send: function() {},
  abort: function() {},
  destroy: function() {},
  setRequestHeader: function( name, value ) {},
  getAllResponseHeaders: function() {},
  getResponseHeader: function( name ) {}
};


// XmlHttpRequest transport
Ajax.modules.XHR = function( wrapper ) {
  var self = this;
  Ajax.modules._Base.call( self, wrapper );

  self._xhr = null;
  self._processing = false;
  self._completed = false;
  self._aborted = false;
  self._tmid = null;
  self._reqHeaders = {};
};

Ajax.modules.XHR.prototype = extend( {}, Ajax.modules._Base.prototype, {
  _dataTypes: {
    json: utils.parseJSON,
    xml: utils.parseXML
  },
  _getXHR: function() {
    return getSimpleXHR();
  },
  _handleResponse: function( response ) {
    var
      self = this,
      options = self._options,
      dataType = options.dataType,
      data,
      convertor;
      
    convertor = self._dataTypes[ dataType ];
    if( convertor ) {
      data = convertor( response );
    } else {
      data = String( response );
    }
    return data;
  },
  _onreadystatechange: function() {
    var
      self = this,
      defer = self._defer,
      xhr = self._xhr,
      isAborted = self._aborted,
      xhrStatus,
      xhrStatusText,
      xhrReadyState,
      xhrResponseXml,
      xhrResponseText,
      response;

    xhrReadyState = xhr.readyState;
    if( !isAborted && xhrReadyState == 4 ) {
      xhrStatus = xhr.status;
      
      try {
        xhrStatusText = xhr.statusText;
      } catch(e) {
        xhrStatusText = "";
      }
      
      if( xhrReadyState == 4 ) {
        var xml = xhr.responseXML;
        if ( xml && xml.documentElement ) {
          xhrResponseXML = xml;
        }
        try {
          xhrResponseText = xhr.responseText;
        } catch(e) {}
      }
    }

    if( isAborted || xhrReadyState == 4 ) {
      xhr.onreadystatechange = null;
      
      clearTimeout( self._tmid );
      
      if( !isAborted ) {
        self._processing = false;
        self._completed = true;
        
        if( xhrStatus >= 200 && xhrStatus < 300 || xhrStatus === 304 ) {
          response = self._handleResponse( xhrResponseText );
          defer.resolve( response );
        } else {
          defer.reject( Ajax.BAD_STATUS );
        }
        
        self._cleanup();
      }
    }
  },
  _abort: function( abortStatus ) {
    var self = this,
      xhr = self._xhr,
      textStatus = STATUSES[ abortStatus ],
      defer = self._defer;
    
    if( xhr ) {
      alert( "abort call" );
      xhr.abort();
    }
    
    self._aborted = true;
    self._processing = false;
    self._completed = true;
    self._onreadystatechange();
    
    // TODO self._wrap.readyState
    self.readyState = 4;
    
    defer.reject( abortStatus );
    
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
        xhr[ k ] = xhrFields[ k ];
      }
    }
    
    // set timeout
    if( options.timeout ) {
      self._tmid = setTimeout(function() {
        self._abort( Ajax.ABORT_TIMEOUT );
      }, options.timeout );
    }
    
    // mark as processing
    self._processing = true;

    // make request
    return xhr.send( method === "POST" ? urlArgs : null );    
  },
  abort: function() {
    var self = this;
    if( !self._completed ) {
      self._abort( Ajax.ABORT_USER );
    }
  },
  setRequestHeader: function( name, value ) {
    var self = this;
    self._reqHeaders[ name ] = value;
  },
  destroy: function() {
    var self = this;
    if( !self._completed ) {
      self._abort( Ajax.SYSTEM_ABORT );
    }
  }
});


// jsonp transport
Ajax.modules.JSONP = function( wrapper ) {
  var self = this;
  Ajax.modules._Base.call( self, wrapper );

};
Ajax.modules.JSONP.prototype = extend( {}, Ajax.modules._Base.prototype, {

});


// statuses
var stid = 1,
  cds = {},
  STATUSES = {};
function addStatus( name, code, text ) {
  name = name.toUpperCase();
  Ajax[ name ] = code;
  STATUSES[ code ] = text;
}
addStatus("ABORT_USER", stid++, "aborted" );
addStatus("ABORT_TIMEOUT", stid++, "timeout" );
addStatus("BAD_STATUS", stid++, "bad status" );
addStatus("SUCCESS", stid++, "OK" );
addStatus("SYSTEM_ABORT", stid++, "system aborted" );
Ajax.STATUSES = STATUSES;


// default options
Ajax.defaults = {
  dataType: "text",
  method: "GET",
  url: ajaxLocation,
  async: true,
  contentType: "application/x-www-form-urlencoded; charset=utf-8",
  xhrFields: {
    withCredentials: false
  },
  jsonp: "callback",
  jsonpCallback: function() {
    return sg.expando + "_" + sg.guid(); 
  },
  scriptCharset: "utf-8",
  CORSDegrade: false,
  CORSUrlDegrade: "domain"
};


// share
sg.Ajax = Ajax;

})( window, SG );

