;(function( window, sg ){
	
var document = window.document,
	utils = sg.utils,
	Event = utils.Event;
	
// from jQuery
var rurl = /^([\w\+\.\-]+:)(?:\/\/([^\/?#:]*)(?::(\d+))?)?/,
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
		return new ActiveXObject( "Microsoft.XMLHTTP" );
	} catch(e) {}
}

var xhr = getSimpleXHR(),
	supportCORS = false,
	supportXDR = typeof XDomainRequest !== "undefined";
if( "withCredentials" in xhr || supportXDR ) {
  supportCORS = true;
  xhr = null;
}


function Ajax( url, options ) {
	var klass,
		urlParts;
	
	options = utils.ext(true, {}, Ajax.defaults, options);
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
	if( options.dataType === "jsonp" ) {
		klass = JSONP;	
	} else {
		klass = XHR;
	}
	return new klass( url, options ); 
}


function BaseAjax( url, options ) {
	var self = this;
		
	self._url = url.replace(/#.*$/, "");
	self._options = options;
	
	// init callbacks bindings
  var options_cbs = ["success", "complete", "error"];
  utils.arrEach(options_cbs, function(cb_name) {
		var cb = options[ cb_name ];
		if( cb && utils.isFn( cb ) ) {
			self.on( cb_name, cb );
		}
  });
}

BaseAjax.prototype = {
	readyState: 0,
	status: 0,
	statusText: "",
	responseText: null,
	responseXML: null,
	
	// protected methods
	_abort: function( code ) {
		
	},
	_cleanup: function() {
		this.off();	
	},
	
	// public methods
	send: function() {
		
	},
	abort: function() {
		
	},
	setRequestHeader: function( name, value ) {
		
	},
	getAllResponseHeaders: function() {
		
	},
	getResponseHeader: function( name ) {
		
	}
};

// append Event methods on|off|fire
utils.ext(BaseAjax.prototype, Event.protoMixin);


function XHR( url, options ) {
	var self = this;
	BaseAjax.call(self, url, options );
	
	self._xhr = null;
	self._processing = false;
	self._completed = false;
	self._aborted = false;
	self._tmid = null;
	self._setReqHeaders = {};
}

XHR.prototype = utils.ext({}, BaseAjax.prototype, {
	_dataTypes: {
		json: utils.parseJSON,
		xml: utils.parseXML
	},
	_getXHR: function() {
		var self = this;
		if( self._options.crossDomain ) {
			if( supportCORS ) {
				if( supportXDR ) {	
					return new XDomainRequest();
				}
				return getSimpleXHR();
			}
		} else {
			return getSimpleXHR();
		}
		return null;
	},
	_handleResponse: function() {
		var self = this,
			options = self._options,
			dataType = options.dataType,
			response = self.responseText,
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
		var self = this,
			xhr = self._xhr,
			aborted = self._aborted,
			status,
			AjaxStatus,
			AjaxTextStatus,
			response = null,
			xml;
		
		if( !aborted ) {
			self.readyState = xhr.readyState;
			self.status = xhr.status;
			try {
				self.statusText = xhr.statusText;
			} catch(e) {
				self.statusText = "";
			}
			
			if( self.readyState == 4 ) {
				xml = xhr.responseXML;
				if ( xml && xml.documentElement ) {
					self.responseXML = xml;
				}
				try {
					self.responseText = xhr.responseText;
				} catch(e) {}
			}
		}
			
		if( aborted || self.readyState == 4 ) {
			xhr.onreadystatechange = null;
			
			clearTimeout( self._tmid );
			
			if( !aborted ) {
				status = self.status;
				
				self._processing = false;
				self._completed = true;
				
				if( status >= 200 && status < 300 || status === 304 ) {
					response = self._handleResponse();
					AjaxStatus = Ajax.SUCCESS;
					AjaxTextStatus = STATUSES[ AjaxStatus ];
					self.fire("success", [ response, AjaxTextStatus ] );
				} else {
					AjaxStatus = Ajax.BAD_STATUS;
					AjaxTextStatus = STATUSES[ AjaxStatus ];
					self.fire("error", [ AjaxStatus, AjaxTextStatus ] );
				}
				
				self.fire("complete", [ response, AjaxStatus, AjaxTextStatus ] );
				self._cleanup();
			}
		}
	},
	_abort: function( status ) {
		var self = this,
			xhr = self._xhr,
			textStatus = STATUSES[ status ];
		
		xhr.abort();
		
		self._aborted = true;
		self._processing = false;
		self._completed = true;
		self._onreadystatechange();
		
		self.readyState = 4;
		
		self.fire("error", [ status, textStatus ] );
		self.fire("complete", [ null, status, textStatus ] );
		
		self._cleanup();
	},
	_cleanup: function() {
		var self = this;
		self._xhr = null;
		self._processing = false;
		self._completed = false;
		self._aborted = false;
		self._tmid = null;
		self._setReqHeaders = {};
		
		self.off();
	},
	
	send: function() {
		var self = this;
		if( self._processing ) {
			throw Error("not supported");
		}
		
		var options = self._options,
			xhr,
			method,
			url,
			urlQSStart,
			urlArgs = "";
			
		xhr = self._getXHR();
		if( !xhr ) {
			throw Error("not supported");
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
		xhr.onreadystatechange = utils.bind( self._onreadystatechange, self );
		
		if( method === "POST" ) {
			self.setRequestHeader("Content-Type", options.contentType );
		}
		if( !options.cache ) {
			self.setRequestHeader("If-Modified-Since", "Sat, 1 Jan 1970 00:00:00 GMT");
		}
		
		if ( !options.crossDomain && !self._setReqHeaders["X-Requested-With"] ) {
			self._setReqHeaders["X-Requested-With"] = "XMLHttpRequest";
		}
		
		utils.objEach( self._setReqHeaders, function( v, k ) {
			xhr.setRequestHeader( k, v );
		});
		
		// set additionals xhr props
		if ( options.xhrFields ) {
			utils.objEach( options.xhrFields, function( v, k ) {
				xhr[ k ] = v;
			});
		}
		
		// mark as processing
		self._processing = true;
		
		// set timeout
		if( options.timeout ) {
			self._tmid = setTimeout(function() {
				self._abort( Ajax.ABORT_TIMEOUT );
			}, options.timeout );
		}
		
		// make request
		xhr.send( method === "POST" ? urlArgs : null );		
	},
	abort: function() {
		var self = this;
		if( !self._completed ) {
			self._abort( Ajax.ABORT_USER );
		}
	},
	setRequestHeader: function( name, value ) {
		var self = this;
		self._setReqHeaders[ name ] = value;
	}
});


function JSONP( url, options ) {
	var self = this;
	BaseAjax.call(self, url, options );
	
	self._script = null;
	self._jsonpCallback = null;
	self._processing = false;
	self._completed = false;
	self._aborted = false;
	self._tmid = null;
}

JSONP.prototype = utils.ext({}, BaseAjax.prototype, {
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
		var self = this,
			status = Ajax.SUCCESS,
			textStatus = STATUSES[ status ];
		self._complete();
		self._rmGlCb();
		
		self.fire("success", [ response, textStatus ] );
		self.fire("complete", [ response, status, textStatus ] );
		
		self._cleanup();
	},
	_complete: function() {
		var self = this;
		
		clearTimeout( self._tmid );
		self._completed = true;
		self._processing = false;
	},
	_addGlCb: function() {
		var self = this;
		window[ self._jsonpCallback ] = utils.bind( self._glCb, self );
	},
	_rmGlCb: function() {
		try {
			delete window[ this._jsonpCallback ];
		} catch( e ) {}
	},
	_replGlCb2Rm: function() {
		var self = this;
		window[ self._jsonpCallback ] = utils.bind( self._rmGlCb, self );
	},
	_abort: function( status ) {
		var self = this,
			statusText = STATUSES[ status ];
		self._aborted = true;
		self._onload();
		
		self.fire("error", [ status, statusText ]);
		self.fire("complete", [ null, status, statusText ] );
		
		self._cleanup();
	},
	_cleanup: function() {
		var self = this;
		// self._script = null;
		// do not clean, because global callback may execute
		// self._jsonpCallback = null;
		self._processing = false;
		self._completed = false;
		self._aborted = false;
		self._tmid = null;
		
		self.off();
	},
	
	// public methods
	send: function() {
		var self = this;
		if( self._processing ) {
			throw Error("not supported");
		}
		
		var options = self._options,
			$head = document.head || utils.$("head,body") || document.documentElement,
			jsonpParam = options.jsonp,
			jsonpCallback = options.jsonpCallback,
			charset = options.scriptCharset,
			$script,
			url,
			extraData = {};
			
		if( utils.isFn(jsonpCallback) ) {
			jsonpCallback = jsonpCallback();
		}
		
		if( options.data ) {
			extraData = utils.ext( extraData, options.data );
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
		$script.onload = $script.onreadystatechange = utils.bind(self._onload, self);

		$script.src = url;
		
		// add props
		self._script = $script;
		self._jsonpCallback = jsonpCallback;
		self._processing = true;
		
		// add general handler
		self._addGlCb();
		
		if( options.timeout ) {
			self._tmid = setTimeout(function() {
				self._abort( Ajax.ABORT_TIMEOUT );
			}, options.timeout);
		}
		
		// insert script node to head for make request
		$head.insertBefore( $script, $head.firstChild );
	},
	abort: function() {
		var self = this;
		if( !self._completed ) {
			self._abort( Ajax.ABORT_USER );
		}
	}
});

// На всякий
Ajax.XHR = XHR;
Ajax.JSONP = JSONP;


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
	scriptCharset: "utf-8"
};

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
Ajax.STATUSES = STATUSES;



// Share
Ajax.base = BaseAjax;
Ajax.supportCORS = supportCORS;
sg.Ajax = Ajax;

})( window, SG );

