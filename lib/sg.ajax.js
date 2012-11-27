;(function( window, sg ){
	
var document = window.document,
	utils = sg.utils,
	Event = sg.Event;

function get_xhr() {
	try {
		return new XMLHttpRequest();
	} catch(e) {}
	try {
		return new ActiveXObject( "Microsoft.XMLHTTP" );
	} catch(e) {}
	return null;
}


function Ajax( url, options ) {
	if( !options ) {
		options = {};
	}
	type
	return new Ajax.prototype.init( url, options ); 
}

Ajax.prototype = {
	readyState: 0,
	status: 0,
	statusText: "",
	responseText: null,
	responseXML: null,
	
	init: function( url, options ) {
		var self = this;
		
		self._url = url;
		self._options = utils.ext(true, {}, Ajax.defaults, options);
	},
	send: function() {
		
	},
	abort: function() {
		
	},
	setRequestHeader: function( name, value ) {
		
	},
	getAllResponseHeaders: function() {
		
	},
	getResponseHeader: function() {
		
	}
};
Ajax.prototype.init.prototype = Ajax.prototype;


function XHR() {}
XHR.prototype = utils.ext({}, Ajax.prototype, {
	init: function( url, options ) {
		Ajax.prototype.init.call(this, url, options);
	}
});


function JSONP() {}
JSONP = utils.ext({}, Ajax.prototype, {
	init: function( url, options ) {
		Ajax.prototype.init.call(this, url, options);
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
	}
};

// Share
sg.Ajax = Ajax;

})( window, SG );

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