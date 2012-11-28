;(function( window, sg ){
	
var document = window.document,
	utils = sg.utils,
	Event = sg.Event;

function Ajax( url, options ) {
	var klass;
	
	options = utils.ext(true, {}, Ajax.defaults, options);
	options.method = options.method.toUpperCase();
	
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
	var self = this,
		options_callbacks = ["success", "complete", "error"],
		i, l, cb;
	
	self._url = url;
	self._options = options;
	
	// init callbacks bindings
	for( l = options_callbacks.length; l--; ) {
		cb = options[options_callbacks[l]];
		if( cb && utils.isFn(cb) ) {
			self.on(options_callbacks[l], cb);
		}
	}
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
		
	},
	
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


function XHR( url, options ) {
	var self = this;
	BaseAjax.call(self, url, options );
	
	self._xhr = null;
	self._processing = false;
	self._completed = false;
	self._aborted = false;
}

XHR.prototype = utils.ext({}, BaseAjax.prototype, {
	_getXHR: function() {
		try {
			return new XMLHttpRequest();
		} catch(e) {}
		try {
			return new ActiveXObject( "Microsoft.XMLHTTP" );
		} catch(e) {}
		return null;
	},
	_abort: function( code ) {
		
	},
	_cleanup: function() {
		self._xhr = null;
		self._processing = false;
		self._completed = false;
		self._aborted = false;
	},
	
	send: function() {
		var self = this;
		if( self._processing ) {
			throw Error("not supported");
		}
		
		var options = self._options,
			xhr;
			
		xhr = self._getXHR();
		if( !xhr ) {
			return;
		}
		
		/*
		function ajax( url, options ) {
			options = options || {};
			
			var xhr;
			try {
				xhr = new window.XMLHttpRequest();
			} catch(e) {
				try {
					xhr = new window.ActiveXObject( "Microsoft.XMLHTTP" );
				} catch( e ) {}
			}
			
			if( xhr ) {
				var	method = options.method && options.method.toLowerCase() || "get",
					success = options.success,
					error = options.error,
					timeout = options.timeout,
					timerId,
					args = "";
				
				if( method === "post" ) {
					var qsStart = url.indexOf( "?" );
					if( ~qsStart ) {
						args = url.slice( qsStart + 1 );
						url = url.substring( 0, qsStart );
					}
				}
				
				xhr.onreadystatechange = function() {
					if( xhr.readyState == 4 ) {
						xhr.onreadystatechange = null;
						clearTimeout( timerId );
						
						if( xhr.status == 200 ) {
							success && success( xhr.responseText );
						} else {
							error && error( "status", xhr.status );
						}
					}
				};
				
				
				if( timeout ) {
					timerId = setTimeout(function() {
						xhr.abort();
					}, timeout );
				}
				
				
				xhr.open( method, url, true );
				if( method === "post" ) {
					xhr.setRequestHeader( "Content-Type", "application/x-www-form-urlencoded" );
				}
				xhr.setRequestHeader( "If-Modified-Since", "Sat, 1 Jan 1970 00:00:00 GMT" );
				xhr.send( method === "post" ? args : null );
			}
		}
		*/		
	},
	abort: function() {
		
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
			
			self._complete();
			
			if( aborted ) {
				self._replGlCb2Rm();
			}
		}
	},
	_glCb: function( response ) {
		var self = this;
		self._complete()
		self._rmGlCb();
		
		self.fire("success", response );
		self.fire("complete", [response, Ajax.SUCCESS] );
		
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
		window[self._jsonpCallback] = utils.bind( self._glCb, self );
	},
	_rmGlCb: function() {
		try {
			delete window[this._jsonpCallback];
		} catch( e ) {}
	},
	_replGlCb2Rm: function() {
		var self = this;
		window[self._jsonpCallback] = utils.bind( self._rmGlCb, self );
	},
	_abort: function( code ) {
		var self = this;
		self._aborted = true;
		self._onload();
		
		self.fire("error", code);
		self.fire("complete", [null, code]);
		
		self._cleanup();
	},
	_cleanup: function() {
		var self = this;
		self._script = null;
		// do not clean, because global callback may execute
		// self._jsonpCallback = null;
		self._processing = false;
		self._completed = false;
		self._aborted = false;
		self._tmid = null;
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
			extraData = utils.ext(extraData, options.data);
		}
		extraData[jsonp] = jsonpCallback;
		if( !options.cache ) {
			extraData["_"] = sg.now();
		}
		
		// remove fragment
		url = self._url.replace(/#.*$/, "");
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


// from jQuery
var ajaxLocation;
try {
	ajaxLocation = location.href;
} catch( e ) {
	ajaxLocation = document.createElement( "a" );
	ajaxLocation.href = "";
	ajaxLocation = ajaxLocation.href;
}

// default options
Ajax.defaults = {
	type: "get",
	url: ajaxLocation,
	async: true,
	contentType: "application/x-www-form-urlencoded; charset=utf-8",
	jsonp: "callback",
	jsonpCallback: function() {
		return sg.expando + "_" + sg.guid(); 
	},
	scriptCharset: "utf-8"
};

// statuses
var stid = 1;
Ajax.ABORT_USER = stid++;
Ajax.ABORT_TIMEOUT = stid++;
Ajax.SUCCESS = stid++;


// Share
Ajax.base = BaseAjax;
sg.Ajax = Ajax;

})( window, SG );
